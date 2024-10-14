from dataclasses import dataclass
from uuid import UUID

from geomatico_django.geometries import Point
from geomatico_django.serialization import AbstractSerializer, PointField
from rest_framework.fields import BooleanField, FloatField, ListField, UUIDField


@dataclass
class ZipMovementDto:
    isUp: bool = None
    speed: float = None


@dataclass
class MerkaatDto:
    uuid: UUID = None
    weeAmount: float = None
    weeLandingPoint: Point = None
    zipMovements: list[ZipMovementDto] = None


class ZipMovementSerializer(AbstractSerializer[ZipMovementDto]):
    isUp = BooleanField(required=True)
    speed = FloatField(required=True)


class MerkaatSerializer(AbstractSerializer[MerkaatDto]):
    uuid = UUIDField(help_text="Uuid", read_only=True)
    weeAmount = FloatField(required=True)
    weeLandingPoint = PointField(read_only=False, required=False)
    zipMovements = ListField(child=ZipMovementSerializer(), required=False)
