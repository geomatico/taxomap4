from django.db.models import Model, TextField
from geomatico_django.repository import AbstractEntityRepository
from geomatico_django.types import EnumWithText

from api.services.mixins import DictionaryMixin


class BasisOfRecordCode(EnumWithText):
    FOSSIL = ('FOSSIL', 'Fossil')
    NON_FOSSIL = ('NON_FOSSIL', 'Non fossil')


class BasisOfRecord(Model, DictionaryMixin):
    code = TextField()
    name_ca = TextField()
    name_en = TextField()
    name_es = TextField()

    def to_dict(self):
        return {self.id: '/'.join([self.name_en, self.name_ca, self.name_es])}

    class Meta:
        managed = False
        db_table = "basis_of_record"


class BasisOfRecordRepository(AbstractEntityRepository):
    model = BasisOfRecord

    def find_all(self):
        return BasisOfRecord.objects.all()

    def get_by_code(self, code: BasisOfRecordCode) -> BasisOfRecord:
        return BasisOfRecord.objects.get(code=code.text())
