from django.contrib.gis.db.models import PointField
from django.db.models import RESTRICT, DateField, ForeignKey, Model
from django.db.models.fields import TextField
from geomatico_django.repository import AbstractEntityRepository
from geomatico_django.types import EnumWithText

from api.repositories.basis_of_record import BasisOfRecord
from api.repositories.institution import Institution
from api.repositories.taxonomy import BackboneItem, TaxonomyRepository


class VerificationStatus(EnumWithText):
    VERIFIED = ('VERIFIED', 'Verified')
    UNVERIFIED = ('UNVERIFIED', 'Unverified')


class Occurrence(Model):
    geometry = PointField()
    collection_code = TextField()
    catalog_number = TextField()
    institution = ForeignKey(Institution, on_delete=RESTRICT)
    basis_of_record = ForeignKey(BasisOfRecord, on_delete=RESTRICT)
    taxon = ForeignKey(BackboneItem, on_delete=RESTRICT)
    event_date = DateField()
    country_code = TextField(null=True)
    municipality = TextField(null=True)
    county = TextField(null=True)
    state_province = TextField(null=True)
    georeference_verification_status = TextField(choices=VerificationStatus.choices())
    identification_verification_status = TextField(choices=VerificationStatus.choices())

    class Meta:
        managed = False
        db_table = "taxomap"


class OccurrenceRepository(AbstractEntityRepository):
    model = Occurrence

    def find_distinct_backbone_ids(self) -> list[int]:
        return list(Occurrence.objects.values_list('taxon_id', flat=True).distinct())

    def save(self, model):
        TaxonomyRepository().update_backbone_id_with_ancestors(model.taxon_id)
        super().save(model)

    def save_or_replace(self, model):
        Occurrence.objects.filter(
            institution_id=model.institution_id,
            collection_code=model.collection_code,
            catalog_number=model.catalog_number,
        ).delete()
        self.save(model)
