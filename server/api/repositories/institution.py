from django.db.models import Model, TextField
from geomatico_django.repository import AbstractEntityRepository
from geomatico_django.types import EnumWithText

from api.services.mixins import DictionaryMixin


class InstitutionCode(EnumWithText):
    IMEDEA = ('IMEDEA', 'Institut Mediterrani d\'Estudis Avançats')
    MCNB = ('MCNB', 'Museu Ciències Naturals Barcelona')
    MVHN = ('MVHN', 'Museu Valencià d\'Història Natural')
    UB = ('UB', 'Universitat de Barcelona')
    IBB = ('IBB', 'Institut Botànic de Barcelona')


class Institution(Model, DictionaryMixin):
    code = TextField()
    name_ca = TextField()
    name_en = TextField()
    name_es = TextField()

    def to_dict(self):
        return {self.id: self.name_ca}

    class Meta:
        managed = False
        db_table = "institution"


class InstitutionRepository(AbstractEntityRepository):
    model = Institution

    def find_all(self):
        return Institution.objects.all()

    def get_by_code(self, code: InstitutionCode) -> Institution:
        return Institution.objects.get(code=code.text())
