from django.db.models import Model
from django.db.models.fields import IntegerField
from geomatico_django.repository import AbstractEntityRepository

from api.repositories.taxonomy import TaxonomyRepository


class Occurrence(Model):
    backbone_id = IntegerField()

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
