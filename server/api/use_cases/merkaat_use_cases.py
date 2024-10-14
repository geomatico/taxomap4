import logging
from logging import INFO
from typing import Iterable
from uuid import UUID, uuid4

from geomatico_django.geometries import Point

from api.dto.merkaat_serializer import MerkaatDto


# just a very stupid use case implementation to verify it works without even a repository
def get_merkaats(entity_uuids: list[UUID]) -> Iterable[MerkaatDto]:
    return [MerkaatDto(uuid=entity_uuid, weeAmount=1000.0) for entity_uuid in entity_uuids]


def get_by_id(entity_uuid: UUID):
    return MerkaatDto(uuid=entity_uuid, weeAmount=1000.0, weeLandingPoint=Point(10, 10))


def create_merkaat(dto: MerkaatDto) -> MerkaatDto:
    logging.Logger('merkaat').log(INFO, "A new merkaat has born!")
    dto.uuid = uuid4()

    # validate we can access list of dtos properly
    assert dto.zipMovements[0].speed > 0
    return dto


def update_merkaat(entity_uuid: UUID, dto: MerkaatDto) -> MerkaatDto:
    logging.Logger('merkaat').log(INFO, "Did they wee more?")
    return dto


def delete_merkaat(entity_uuid: UUID) -> None:
    logging.Logger('merkaat').log(INFO, "A new merkaat has died :(")
