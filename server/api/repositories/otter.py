from typing import Iterable

from django.contrib.gis.db import models
from geomatico_django.models import AbstractVersionedEntityModel
from geomatico_django.repository import AbstractVersionedEntityRepository


class Otter(AbstractVersionedEntityModel):
    slug = models.SlugField(primary_key=True, max_length=255)
    bath_time = models.FloatField(null=False)


class OtterRepository(AbstractVersionedEntityRepository):
    model = Otter

    def find_all(self) -> Iterable[Otter]:
        return Otter.objects.all()
