from django.contrib.gis.db.models import PointField
from django.db.models import RESTRICT, ForeignKey, Model
from django.db.models.fields import IntegerField, TextField
from geomatico_django.repository import AbstractEntityRepository

from api.repositories.basis_of_record import BasisOfRecord
from api.repositories.institution import Institution
from api.repositories.taxonomy import BackboneItem, TaxonomyRepository


class Occurrence(Model):
    geom = PointField()
    occurrence_id = TextField()
    collection_code = TextField()
    catalog_number = TextField()
    institution = ForeignKey(Institution, on_delete=RESTRICT)
    basis_of_record = ForeignKey(BasisOfRecord, on_delete=RESTRICT)
    backbone = ForeignKey(BackboneItem, on_delete=RESTRICT)
    year = IntegerField()
    month = IntegerField()
    day = IntegerField()
    municipality = TextField()
    county = TextField()
    state_province = TextField()

    class Meta:
        managed = False
        db_table = "taxomap"


class OccurrenceRepository(AbstractEntityRepository):
    model = Occurrence

    def find_distinct_backbone_ids(self) -> list[int]:
        return list(Occurrence.objects.values_list('backbone_id', flat=True).distinct())

    def save(self, model):
        TaxonomyRepository().update_backbone_id_with_ancestors(model.backbone_id)
        super().save(model)

    def save_or_replace(self, model):
        Occurrence.objects.filter(
            institution_id=model.institution_id,
            collection_code=model.collection_code,
            catalog_number=model.catalog_number,
        ).delete()
        self.save(model)
