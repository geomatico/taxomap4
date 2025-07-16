from dataclasses import dataclass
from enum import Enum
from functools import cache
from typing import Iterable, Optional

from django.db.models import IntegerField, Model, TextField

from api.repositories.occurrence import Occurrence


@dataclass
class TaxonomyItem:
    id: int = None
    name: str = None
    parent_id: Optional[int] = None
    parent_name: Optional[str] = None
    parent_rank_name: Optional[str] = None

    def to_dict(self) -> dict:
        ret = {
            "id": self.id,
            "name": self.name,
        }
        if self.parent_id and self.parent_rank_name:
            ret[f"{self.parent_rank_name}_id"] = self.parent_id
        return ret


class GbifItem(Model):
    canonical_name = TextField()
    parent_key = IntegerField()
    rank = TextField()

    class Meta:
        managed = False
        db_table = "backbone"


class TaxonomyRank(Enum):
    # values are model field names and must match Occurrence
    DOMAIN = 'domain'
    KINGDOM = 'kingdom'
    PHYLUM = 'phylum'
    CLASS = 'clazz'
    ORDER = 'order'
    FAMILY = 'family'
    GENUS = 'genus'
    SPECIES = 'species'
    SUBSPECIES = 'subspecies'


@dataclass
class TaxonomyTree:
    kingdom: TaxonomyItem
    phylum: TaxonomyItem
    clazz: TaxonomyItem = None
    order: TaxonomyItem = None
    family: TaxonomyItem = None
    genus: TaxonomyItem = None
    species: TaxonomyItem = None
    subspecies: TaxonomyItem = None


class TaxonomyRepository:
    def get_domains(self) -> list[TaxonomyItem]:
        items = self._query_distinct_ordered(TaxonomyRank.DOMAIN)
        return [TaxonomyItem(id=i, name=item.name) for i, item in enumerate(items, start=1)]

    def get_kingdoms(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.KINGDOM, parent_rank=TaxonomyRank.DOMAIN)

    def get_phyla(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.PHYLUM, parent_rank=TaxonomyRank.KINGDOM)

    def get_classes(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.CLASS, parent_rank=TaxonomyRank.PHYLUM)

    def get_orders(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.ORDER, parent_rank=TaxonomyRank.CLASS)

    def get_families(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.FAMILY, parent_rank=TaxonomyRank.ORDER)

    def get_genera(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.GENUS, parent_rank=TaxonomyRank.FAMILY)

    def get_species(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.SPECIES, parent_rank=TaxonomyRank.GENUS)

    def get_subspecies(self) -> list[TaxonomyItem]:
        return self._get(children_rank=TaxonomyRank.SUBSPECIES, parent_rank=TaxonomyRank.SPECIES)

    @cache
    def get_subspecies_items(self, genus, species, subspecies) -> Iterable[GbifItem]:
        items = (
            GbifItem.objects
            .filter(canonical_name=subspecies)
            .filter(rank__in=('SUBSPECIES', 'FORM', 'VARIETY'))
        )
        if not items and genus and species and subspecies:
            full_name = f'{genus.strip()} {species.strip().lower()} {subspecies.strip().lower()}'
            items = (
                GbifItem.objects
                .filter(canonical_name=full_name)
                .filter(rank__in=('SUBSPECIES', 'FORM', 'VARIETY'))
            )
        return items

    @cache
    def get_species_items(self, genus, species) -> Iterable[GbifItem]:
        items = (
            GbifItem.objects
            .filter(canonical_name=species)
            .filter(rank='SPECIES')
        )
        if not items and genus and species:
            full_name = f'{genus.strip()} {species.strip().lower()}'
            items = (
                GbifItem.objects
                .filter(canonical_name=full_name)
                .filter(rank='SPECIES')
            )
        return items

    def get_subspecies_tree(self, occurrence: Occurrence) -> Optional[TaxonomyTree]:
        items = self.get_subspecies_items(occurrence.genus, occurrence.species, occurrence.subspecies)
        for item in items:
            ancestors = self._find_ancestors(
                item,
                TaxonomyRank.SPECIES,
                TaxonomyRank.GENUS,
                TaxonomyRank.FAMILY,
                TaxonomyRank.ORDER,
                TaxonomyRank.CLASS,
                TaxonomyRank.PHYLUM,
                TaxonomyRank.KINGDOM
            )
            species = _find_ancestor(ancestors, TaxonomyRank.SPECIES)
            genus = _find_ancestor(ancestors, TaxonomyRank.GENUS)
            family = _find_ancestor(ancestors, TaxonomyRank.FAMILY)
            order = _find_ancestor(ancestors, TaxonomyRank.ORDER)
            clazz = _find_ancestor(ancestors, TaxonomyRank.CLASS)
            phylum = _find_ancestor(ancestors, TaxonomyRank.PHYLUM)
            kingdom = _find_ancestor(ancestors, TaxonomyRank.KINGDOM)
            if kingdom:
                return TaxonomyTree(
                    kingdom=_to_kingdom(kingdom, occurrence.kingdom),
                    phylum=_to_phylum(phylum, parent=kingdom, expected_name=occurrence.phylum),
                    clazz=_to_class(clazz, parent=phylum, expected_name=occurrence.clazz),
                    order=_to_order(order, parent=clazz, expected_name=occurrence.order),
                    family=_to_family(family, parent=order, expected_name=occurrence.family),
                    genus=_to_genus(genus, parent=family, expected_name=occurrence.genus),
                    species=_to_species(species, parent=genus, expected_name=occurrence.species),
                    subspecies=_to_subspecies(item, parent=species, expected_name=occurrence.subspecies),
                )

    def get_species_tree(self, occurrence: Occurrence) -> Optional[TaxonomyTree]:
        items = self.get_species_items(occurrence.genus, occurrence.species)
        for item in items:
            ancestors = self._find_ancestors(
                item,
                TaxonomyRank.GENUS,
                TaxonomyRank.FAMILY,
                TaxonomyRank.ORDER,
                TaxonomyRank.CLASS,
                TaxonomyRank.PHYLUM,
                TaxonomyRank.KINGDOM
            )
            genus = _find_ancestor(ancestors, TaxonomyRank.GENUS)
            family = _find_ancestor(ancestors, TaxonomyRank.FAMILY)
            order = _find_ancestor(ancestors, TaxonomyRank.ORDER)
            clazz = _find_ancestor(ancestors, TaxonomyRank.CLASS)
            phylum = _find_ancestor(ancestors, TaxonomyRank.PHYLUM)
            kingdom = _find_ancestor(ancestors, TaxonomyRank.KINGDOM)
            if kingdom:
                return TaxonomyTree(
                    kingdom=_to_kingdom(kingdom, occurrence.kingdom),
                    phylum=_to_phylum(phylum, parent=kingdom, expected_name=occurrence.phylum),
                    clazz=_to_class(clazz, parent=phylum, expected_name=occurrence.clazz),
                    order=_to_order(order, parent=clazz, expected_name=occurrence.order),
                    family=_to_family(family, parent=order, expected_name=occurrence.family),
                    genus=_to_genus(genus, parent=family, expected_name=occurrence.genus),
                    species=_to_species(item, parent=genus, expected_name=occurrence.species),
                )

    def get_genus_tree(self, occurrence: Occurrence) -> Optional[TaxonomyTree]:
        items = GbifItem.objects.filter(canonical_name=occurrence.genus).filter(rank='GENUS')
        for item in items:
            ancestors = self._find_ancestors(
                item,
                TaxonomyRank.FAMILY,
                TaxonomyRank.ORDER,
                TaxonomyRank.CLASS,
                TaxonomyRank.PHYLUM,
                TaxonomyRank.KINGDOM
            )
            family = _find_ancestor(ancestors, TaxonomyRank.FAMILY)
            order = _find_ancestor(ancestors, TaxonomyRank.ORDER)
            clazz = _find_ancestor(ancestors, TaxonomyRank.CLASS)
            phylum = _find_ancestor(ancestors, TaxonomyRank.PHYLUM)
            kingdom = _find_ancestor(ancestors, TaxonomyRank.KINGDOM)
            if kingdom:
                return TaxonomyTree(
                    kingdom=_to_kingdom(kingdom, occurrence.kingdom),
                    phylum=_to_phylum(phylum, parent=kingdom, expected_name=occurrence.phylum),
                    clazz=_to_class(clazz, parent=phylum, expected_name=occurrence.clazz),
                    order=_to_order(order, parent=clazz, expected_name=occurrence.order),
                    family=_to_family(family, parent=order, expected_name=occurrence.family),
                    genus=_to_genus(item, parent=family, expected_name=occurrence.genus),
                )

    def get_family_tree(self, occurrence: Occurrence) -> Optional[TaxonomyTree]:
        items = GbifItem.objects.filter(canonical_name=occurrence.family).filter(rank='FAMILY')
        for item in items:
            ancestors = self._find_ancestors(
                item,
                TaxonomyRank.ORDER,
                TaxonomyRank.CLASS,
                TaxonomyRank.PHYLUM,
                TaxonomyRank.KINGDOM
            )
            order = _find_ancestor(ancestors, TaxonomyRank.ORDER)
            clazz = _find_ancestor(ancestors, TaxonomyRank.CLASS)
            phylum = _find_ancestor(ancestors, TaxonomyRank.PHYLUM)
            kingdom = _find_ancestor(ancestors, TaxonomyRank.KINGDOM)
            if kingdom:
                return TaxonomyTree(
                    kingdom=_to_kingdom(kingdom, occurrence.kingdom),
                    phylum=_to_phylum(phylum, parent=kingdom, expected_name=occurrence.phylum),
                    clazz=_to_class(clazz, parent=phylum, expected_name=occurrence.clazz),
                    order=_to_order(order, parent=clazz, expected_name=occurrence.order),
                    family=_to_family(item, parent=order, expected_name=occurrence.family),
                )

    def get_order_tree(self, occurrence: Occurrence) -> Optional[TaxonomyTree]:
        items = GbifItem.objects.filter(canonical_name=occurrence.order).filter(rank='ORDER')
        for item in items:
            ancestors = self._find_ancestors(
                item,
                TaxonomyRank.CLASS,
                TaxonomyRank.PHYLUM,
                TaxonomyRank.KINGDOM
            )
            clazz = _find_ancestor(ancestors, TaxonomyRank.CLASS)
            phylum = _find_ancestor(ancestors, TaxonomyRank.PHYLUM)
            kingdom = _find_ancestor(ancestors, TaxonomyRank.KINGDOM)
            if kingdom:
                return TaxonomyTree(
                    kingdom=_to_kingdom(kingdom, occurrence.kingdom),
                    phylum=_to_phylum(phylum, parent=kingdom, expected_name=occurrence.phylum),
                    clazz=_to_class(clazz, parent=phylum, expected_name=occurrence.clazz),
                    order=_to_order(item, parent=clazz, expected_name=occurrence.order),
                )

    def get_class_tree(self, occurrence: Occurrence) -> Optional[TaxonomyTree]:
        items = GbifItem.objects.filter(canonical_name=occurrence.clazz).filter(rank='CLASS')
        for item in items:
            ancestors = self._find_ancestors(
                item,
                TaxonomyRank.PHYLUM,
                TaxonomyRank.KINGDOM
            )
            phylum = _find_ancestor(ancestors, TaxonomyRank.PHYLUM)
            kingdom = _find_ancestor(ancestors, TaxonomyRank.KINGDOM)
            if kingdom:
                return TaxonomyTree(
                    kingdom=_to_kingdom(kingdom, occurrence.kingdom),
                    phylum=_to_phylum(phylum, parent=kingdom, expected_name=occurrence.phylum),
                    clazz=_to_class(item, parent=phylum, expected_name=occurrence.clazz),
                )

    def get_phylum_tree(self, occurrence: Occurrence) -> Optional[TaxonomyTree]:
        items = GbifItem.objects.filter(canonical_name=occurrence.phylum).filter(rank='PHYLUM')
        for item in items:
            ancestors = self._find_ancestors(
                item,
                TaxonomyRank.KINGDOM
            )
            kingdom = _find_ancestor(ancestors, TaxonomyRank.KINGDOM)
            if kingdom:
                return TaxonomyTree(
                    kingdom=_to_kingdom(kingdom, occurrence.kingdom),
                    phylum=_to_phylum(item, parent=kingdom, expected_name=occurrence.phylum),
                )

    def _get(self, children_rank: TaxonomyRank, parent_rank: TaxonomyRank) -> list[TaxonomyItem]:
        parents = self._query_distinct_ordered(rank=parent_rank)
        parent_id_by_name = {item.name: i for i, item in enumerate(parents, start=1)}
        children = self._query_distinct_ordered(rank=children_rank, parent_rank=parent_rank)
        return [
            TaxonomyItem(
                id=i,
                name=child.name,
                parent_rank_name=parent_rank.name.lower(),
                parent_name=child.parent_name,
                parent_id=parent_id_by_name.get(child.parent_name)
            ) for i, child in enumerate(children, start=1)
        ]

    def _query_distinct_ordered(
            self, rank: TaxonomyRank, parent_rank: TaxonomyRank = None
    ) -> Iterable[TaxonomyItem]:
        """
        Return an array of TaxonomyItems with name if only rank is provided, or name and parent_name
          if both rank and parent are provided. Array is ordered by rank in any case.
        """
        query = Occurrence.objects.order_by(rank.value).filter(**{rank.value + '__isnull': False})
        if rank == TaxonomyRank.SUBSPECIES:
            # exclude empty strings only for subspecies ¯\_(ツ)_/¯
            query = query.exclude(**{rank.value + '__regex': '^\\s*$'})
        if parent_rank:
            query = query.values_list(parent_rank.value, rank.value)
            return [TaxonomyItem(parent_name=row[0], name=row[1]) for row in query.distinct()]
        else:
            query = query.values_list(rank.value, flat=True)
        return [TaxonomyItem(name=row) for row in query.distinct()]

    def _find_ancestors(self, item: GbifItem, *ranks: TaxonomyRank) -> list[GbifItem]:
        if item is None:
            return []

        ancestors = []
        while item.parent_key is not None:
            item = GbifItem.objects.get(id=item.parent_key)
            if _to_taxonomy_rank(item.rank) in ranks:
                ancestors.append(item)
        return ancestors


def _to_taxonomy_item(
        item: GbifItem,
        expected_rank: TaxonomyRank, expected_name,
        parent: Optional[GbifItem]
) -> Optional[TaxonomyItem]:
    if expected_name:
        if not item:
            # gap in gbif but not in our tree; we might lose some data
            raise MissingGbifRank(rank=expected_rank, expected_name=expected_name)
        else:
            # both trees have information
            if item.canonical_name != expected_name:
                # names don't match
                raise NamesNotMatching(item=item, expected_name=expected_name)
            else:
                # names do match, all good
                return TaxonomyItem(
                    id=item.id,
                    name=item.canonical_name,
                    parent_id=parent.id if parent is not None else None,
                    parent_name=parent.canonical_name if parent is not None else None,
                )
    else:
        # a gap in our tree
        if item:
            # it's fine, backbone provides more information that we had in our tree
            return TaxonomyItem(
                id=item.id,
                name=item.canonical_name,
                parent_id=parent.id if parent is not None else None,
                parent_name=parent.canonical_name if parent is not None else None,
            )
        else:
            # fine as well, gaps in both trees
            return None


def _to_kingdom(item: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.KINGDOM, expected_name=expected_name, parent=None)


def _to_phylum(item: GbifItem, parent: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.PHYLUM, expected_name=expected_name, parent=parent)


def _to_class(item: GbifItem, parent: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.CLASS, expected_name=expected_name, parent=parent)


def _to_order(item: GbifItem, parent: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.ORDER, expected_name=expected_name, parent=parent)


def _to_family(item: GbifItem, parent: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.FAMILY, expected_name=expected_name, parent=parent)


def _to_genus(item: GbifItem, parent: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.GENUS, expected_name=expected_name, parent=parent)


def _to_species(item: GbifItem, parent: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.SPECIES, expected_name=expected_name, parent=parent)


def _to_subspecies(item: GbifItem, parent: GbifItem, expected_name: str):
    return _to_taxonomy_item(item, expected_rank=TaxonomyRank.SUBSPECIES, expected_name=expected_name, parent=parent)


def _to_taxonomy_rank(backbone_rank_str):
    return TaxonomyRank[backbone_rank_str if backbone_rank_str not in ('VARIETY', 'FORM') else 'SUBSPECIES']


def _find_ancestor(ancestors: list[GbifItem], rank: TaxonomyRank) -> Optional[GbifItem]:
    try:
        return next(ancestor for ancestor in ancestors if _to_taxonomy_rank(ancestor.rank) == rank)
    except StopIteration:
        return None


class NamesNotMatching(Exception):
    def __init__(self, item: GbifItem, expected_name: str):
        self.item = item
        self.expected_name = expected_name


class MissingGbifRank(Exception):
    def __init__(self, rank: TaxonomyRank, expected_name: str):
        self.rank = rank.value
        self.expected_name = expected_name
