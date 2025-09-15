from django.db.models import Model, TextField
from geomatico_django.repository import AbstractEntityRepository

from api.services.mixins import DictionaryMixin


class Institution(Model, DictionaryMixin):
    name = TextField()

    def to_dict(self):
        return {self.id: self.name}

    class Meta:
        managed = False
        db_table = "institution"


class InstitutionRepository(AbstractEntityRepository):
    model = Institution

    def find_all(self):
        return Institution.objects.all()
