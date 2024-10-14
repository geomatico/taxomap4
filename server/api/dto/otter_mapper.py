from geomatico_django.dto import AbstractMapper

from api.dto.otter_serializer import OtterDto
from api.repositories.otter import Otter


class OtterMapper(AbstractMapper[OtterDto, Otter]):
    def to_dto(self, domain: Otter) -> OtterDto:
        return OtterDto(
            slug=domain.slug,
            bathTime=domain.bath_time
        )

    def update_from_dto(self, domain: Otter, dto: OtterDto) -> None:
        domain.slug = dto.slug
        domain.bath_time = dto.bathTime
