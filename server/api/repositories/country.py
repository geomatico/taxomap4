from typing import Iterable

from django.db import models
from geomatico_django.repository import AbstractEntityRepository


class Country(models.Model):
    code = models.CharField(primary_key=True, max_length=2)
    name_ca = models.TextField()
    name_en = models.TextField()
    name_es = models.TextField()

    class Meta:
        managed = False
        db_table = 'country'


class CountryRepository(AbstractEntityRepository):
    model = Country

    def find_all(self) -> Iterable[Country]:
        return Country.objects.all()

    def exists_by_code(self, code):
        return Country.objects.filter(code=code).exists()
