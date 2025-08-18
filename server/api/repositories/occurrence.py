from django.db.models import Model
from django.db.models.fields import TextField
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

    class Meta:
        managed = False
        db_table = "taxomap"


class OccurrenceRepository(AbstractEntityRepository):
    model = Occurrence
