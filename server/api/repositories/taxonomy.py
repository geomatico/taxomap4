from dataclasses import dataclass
from enum import Enum
from typing import Optional

from django.db.models import RESTRICT, ForeignKey, IntegerField, Model, TextField

from api.services.mixins import DictionaryMixin


class TaxonomyRank(Enum):
    DOMAIN = ('DOMAIN', 'domain')
    KINGDOM = ('KINGDOM', 'kingdom')
    PHYLUM = ('PHYLUM', 'phylum')
    CLASS = ('CLASS', 'clazz')
    ORDER = ('ORDER', 'order')
    FAMILY = ('FAMILY', 'family')
    GENUS = ('GENUS', 'genus')
    SPECIES = ('SPECIES', 'species')
    SUBSPECIES = ('SUBSPECIES', 'subspecies')

    @property
    def db_value(self):
        """ Returns the values used in the database for the rank column. """
        return self.value[0]

    @property
    def id_property_name(self):
        """ Returns the name of the property used in the Django model. """
        property_name = self.value[1]
        return f'{property_name}_id'

    @property
    def parent(self):
        if self == TaxonomyRank.DOMAIN:
            return None
        ranks = list(TaxonomyRank)
        return ranks[ranks.index(self) - 1]


_VALID_DB_RANK_VALUES = [
    TaxonomyRank.SUBSPECIES.db_value,
    TaxonomyRank.SPECIES.db_value,
    TaxonomyRank.GENUS.db_value,
    TaxonomyRank.FAMILY.db_value,
    TaxonomyRank.ORDER.db_value,
    TaxonomyRank.CLASS.db_value,
    TaxonomyRank.PHYLUM.db_value,
    TaxonomyRank.KINGDOM.db_value,
]


@dataclass(frozen=True)
class TaxonomyItem(DictionaryMixin):
    id: int = None
    name: str = None
    parent_id: Optional[int] = None
    parent_rank_name: Optional[str] = None

    def to_dict(self) -> dict:
        ret = {
            "id": self.id,
            "name": self.name,
        }
        if self.parent_id and self.parent_rank_name:
            ret[f"{self.parent_rank_name}_id"] = self.parent_id
        return ret


class BackboneItem(Model):
    canonical_name = TextField()
    parent_key = IntegerField()
    rank = TextField()

    class Meta:
        managed = False
        db_table = "backbone"


class BackboneItemWithAncestors(Model):
    canonical_name = TextField()
    rank = TextField()
    kingdom = ForeignKey(BackboneItem, on_delete=RESTRICT, related_name='kingdoms')
    phylum = ForeignKey(BackboneItem, on_delete=RESTRICT, related_name='phyla')
    clazz = ForeignKey(BackboneItem, on_delete=RESTRICT, db_column='class_id', related_name='classes')
    order = ForeignKey(BackboneItem, on_delete=RESTRICT, related_name='orders')
    family = ForeignKey(BackboneItem, on_delete=RESTRICT, related_name='families')
    genus = ForeignKey(BackboneItem, on_delete=RESTRICT, related_name='genera')
    species = ForeignKey(BackboneItem, on_delete=RESTRICT, related_name='species_list')
    subspecies = ForeignKey(BackboneItem, on_delete=RESTRICT, related_name='subspecies_list')

    class Meta:
        managed = False
        db_table = "backbone_with_ancestors"


class TaxonomyRepository:
    def exists_by_id(self, id: int) -> bool:
        return BackboneItem.objects.filter(id=id).exists()

    def update_backbone_id_with_ancestors(self, backbone_id, force: bool = False):
        if BackboneItemWithAncestors.objects.filter(id=backbone_id).exists() and not force:
            return
        self._get_ancestors(backbone_id).save()

    def _get_ancestors(self, backbone_id: int) -> BackboneItemWithAncestors:
        item = BackboneItem.objects.get(id=backbone_id)
        ancestors = _find_ancestors(item)

        def _get_item_or_ancestor_id(rank: TaxonomyRank):
            item_or_ancestor = item if item.rank == rank.db_value else _find_ancestor(ancestors, rank)
            return item_or_ancestor.id if item_or_ancestor else None

        return BackboneItemWithAncestors(
            id=item.id,
            canonical_name=item.canonical_name,
            rank=item.rank,
            kingdom_id=_get_item_or_ancestor_id(TaxonomyRank.KINGDOM),
            phylum_id=_get_item_or_ancestor_id(TaxonomyRank.PHYLUM),
            clazz_id=_get_item_or_ancestor_id(TaxonomyRank.CLASS),
            order_id=_get_item_or_ancestor_id(TaxonomyRank.ORDER),
            family_id=_get_item_or_ancestor_id(TaxonomyRank.FAMILY),
            genus_id=_get_item_or_ancestor_id(TaxonomyRank.GENUS),
            species_id=_get_item_or_ancestor_id(TaxonomyRank.SPECIES),
            subspecies_id=_get_item_or_ancestor_id(TaxonomyRank.SUBSPECIES),
        )

    def get_domains(self) -> list[TaxonomyItem]:
        # gbif does not have domain information; we assume it's always Eukaryota
        return [TaxonomyItem(
            id=1,
            name='Eukaryota',
            parent_id=None,
            parent_rank_name=None
        )]

    def get_kingdoms(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.KINGDOM)

    def get_phyla(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.PHYLUM)

    def get_classes(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.CLASS)

    def get_orders(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.ORDER)

    def get_families(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.FAMILY)

    def get_genera(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.GENUS)

    def get_species(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.SPECIES)

    def get_subspecies(self) -> list[TaxonomyItem]:
        return self._get_distinct(TaxonomyRank.SUBSPECIES)

    def _get_distinct(self, rank: TaxonomyRank) -> list[TaxonomyItem]:
        item_ids = BackboneItemWithAncestors.objects.values_list(rank.id_property_name, flat=True).distinct()
        items = BackboneItem.objects.filter(id__in=item_ids)
        return [TaxonomyItem(
            id=item.id,
            name=item.canonical_name,
            parent_id=item.parent_key if rank != TaxonomyRank.KINGDOM else 1,
            parent_rank_name=(rank.parent if rank != TaxonomyRank.KINGDOM else TaxonomyRank.DOMAIN).db_value.lower(),
        ) for item in items]


def _find_ancestors(item: BackboneItem) -> list[BackboneItem]:
    if item is None:
        return []

    ancestor_ranks = (
        _VALID_DB_RANK_VALUES[_VALID_DB_RANK_VALUES.index(item.rank) + 1:]
        if item.rank in _VALID_DB_RANK_VALUES
        else _VALID_DB_RANK_VALUES
    )

    ancestors = []
    while item.parent_key is not None:
        item = BackboneItem.objects.get(id=item.parent_key)
        if item.rank in ancestor_ranks:
            ancestors.append(item)
    return ancestors


def _find_ancestor(ancestors: list[BackboneItem], rank: TaxonomyRank) -> Optional[BackboneItem]:
    try:
        return next(
            ancestor for ancestor in ancestors
            if TaxonomyRank[ancestor.rank if ancestor.rank not in ('VARIETY', 'FORM') else 'SUBSPECIES'] == rank
        )
    except StopIteration:
        return None


def _to_taxonomy_item(item: BackboneItem, parent: Optional[BackboneItem]) -> Optional[TaxonomyItem]:
    return TaxonomyItem(
        id=item.id,
        name=item.canonical_name,
        parent_rank_name=parent.rank.lower() if parent else None,
        parent_id=parent.id if parent else None,
    ) if item else None
