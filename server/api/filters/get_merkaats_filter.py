from typing import List
from uuid import UUID

from geomatico_django.filters import AbstractFilter, CsvFilter
from rest_framework.fields import UUIDField


class GetMerkaatsFilter(AbstractFilter):
    uuid = CsvFilter(required=True, help_text="Uuid", child=UUIDField())

    def get_uuids(self) -> List[UUID]:
        return self.validated_data["uuid"] if "uuid" in self.validated_data else None
