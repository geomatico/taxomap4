from django.db.models import Model
from django.db.models.fields import BooleanField, IntegerField, TextField
from geomatico_django.repository import AbstractEntityRepository


class Occurrence(Model):
    domain = TextField()
    kingdom = TextField()
    phylum = TextField()
    clazz = TextField(db_column='class')
    order = TextField()
    family = TextField()
    genus = TextField()
    species = TextField()
    subspecies = TextField()
    backbone_id = IntegerField()
    gbif_notes = TextField()
    is_visible = BooleanField()

    class Meta:
        managed = False
        db_table = "taxomap"


class OccurrenceRepository(AbstractEntityRepository):
    model = Occurrence

    # TODO TAX-73 remove after gbif match done
    def find_batch(self, limit):
        return (
            Occurrence.objects
            .filter(is_visible=True)
            .filter(backbone_id__isnull=True)
            .order_by('id')
            [:limit]
        )
