import pytest

from api.repositories.occurrence import Occurrence, OccurrenceRepository
from api.repositories.taxonomy import BackboneItemWithAncestors

cut = OccurrenceRepository()


@pytest.mark.django_db
def test_update_backbone_ancestors():
    # GIVEN
    occurrence = Occurrence(taxon_id=4406427)
    assert not BackboneItemWithAncestors.objects.filter(id=4406427).exists()

    # WHEN
    cut.save(occurrence)

    # THEN
    item_with_ancestors = BackboneItemWithAncestors.objects.get(id=4406427)
    assert item_with_ancestors.canonical_name == 'Abacetus'
    assert item_with_ancestors.rank == 'GENUS'
    assert item_with_ancestors.kingdom_id == 1
    assert item_with_ancestors.phylum_id == 54
    assert item_with_ancestors.clazz_id == 216
    assert item_with_ancestors.order_id == 1470
    assert item_with_ancestors.family_id == 3792
    assert item_with_ancestors.genus_id == 4406427
    assert item_with_ancestors.species_id is None
    assert item_with_ancestors.subspecies_id is None
