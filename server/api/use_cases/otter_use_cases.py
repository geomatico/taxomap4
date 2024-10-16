from typing import Iterable

from geomatico_django.exceptions import delete_or_404, find_or_404

from api.dto.otter_mapper import OtterMapper
from api.dto.otter_serializer import OtterDto
from api.repositories.otter import OtterRepository


def get_otters() -> Iterable[OtterDto]:
    return OtterMapper().to_dtos(OtterRepository().find_all())


def create_otter(dto: OtterDto) -> OtterDto:
    mapper = OtterMapper()
    otter = mapper.to_domain(dto)
    otter = OtterRepository().save_entity(otter)
    return mapper.to_dto(otter)


def get_by_id(otter_slug: str):
    return OtterMapper().to_dto(find_or_404(OtterRepository(), otter_slug))


def update_otter(otter_slug: str, dto: OtterDto) -> OtterDto:
    mapper = OtterMapper()
    repository = OtterRepository()

    otter = find_or_404(repository, otter_slug)
    mapper.update_from_dto(otter, dto)
    otter = repository.save_entity(otter)

    return mapper.to_dto(otter)


def delete_otter(otter_slug: str) -> None:
    # :(
    delete_or_404(OtterRepository(), otter_slug)
