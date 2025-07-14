from dataclasses import dataclass
from enum import Enum
from typing import Iterable, Optional

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
