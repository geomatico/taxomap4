import pytest
from rest_framework.exceptions import ParseError

from api.repositories.occurrence import Occurrence
from api.services import csv_upload_service as cut


@pytest.mark.django_db
def test_missing_columns():
    # GIVEN
    csv = iter([
        ['collection_code', 'catalog_number', 'gbif_id'],
        ['MCNB-Art', 'MZB 87-490', '3792'],
        ['MCNB-Art', 'MZB 87-489', '3792'],
    ])

    # WHEN
    with pytest.raises(ParseError) as e:
        cut.persist_csv(csv)

    # THEN
    assert e.value.detail == (
        "Invalid CSV. Missing columns: ['latitude', 'longitude', 'date', "
        "'institution', 'basisOfRecord', 'municipality', 'county', 'stateProvince']"
    )


@pytest.mark.django_db
def test_success_with_some_errors():
    # GIVEN
    csv = iter([
        ['collection_code', 'catalog_number', 'gbif_id', 'longitude', 'latitude', 'date', 'institution',
         'basisOfRecord', 'municipality', 'county', 'stateProvince'],
        ['MCNB-Art', 'MZB 87-4959', '3792', '117', '5', '1995-05-20', 'MCNB', 'FOSSIL', '', '', ''],
        ['MCNB-Art', 'MZB 87-496', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', ''],
        ['MCNB-Art', 'MZB 87-495', '3792', '117', '5', '2025-05-20', 'MCNB', 'BOB', '', '', ''],
        ['MCNB-Art', 'MZB 87-494', '3792', '117', '5', '2025-05-20', 'BOB', 'FOSSIL', '', '', ''],
        ['MCNB-Art', 'MZB 87-493', '3792', '117', '5', '2025', 'MCNB', 'FOSSIL', '', '', ''],
        ['', 'MZB 87-492', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', ''],
        ['MCNB-Art', '', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', ''],
        ['MCNB-Art', 'MZB 87-491', '-2', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', ''],
        ['MCNB-Art', 'MZB 87-490', '3792', 'x', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', ''],
        ['MCNB-Art', 'MZB 87-489', '3792', '117', 'y', '2025-05-20', 'MCNB', 'FOSSIL', '', '', ''],
    ])

    # WHEN
    errors = cut.persist_csv(csv)

    # THEN
    assert errors == [
        ['collection_code', 'catalog_number', 'gbif_id', 'longitude', 'latitude', 'date', 'institution',
         'basisOfRecord', 'municipality', 'county', 'stateProvince'],
        ['MCNB-Art', 'MZB 87-495', '3792', '117', '5', '2025-05-20', 'MCNB', 'BOB', '', '', '',
         'Invalid basis of record: BOB'],
        ['MCNB-Art', 'MZB 87-494', '3792', '117', '5', '2025-05-20', 'BOB', 'FOSSIL', '', '', '',
         'Invalid institution: BOB'],
        ['MCNB-Art', 'MZB 87-493', '3792', '117', '5', '2025', 'MCNB', 'FOSSIL', '', '', '',
         'Fecha no válida (ISO8601 YYYY-MM-DD): 2025'],
        ['', 'MZB 87-492', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '',
         "Nulos para las columnas: ['collection_code']"],
        ['MCNB-Art', '', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '',
         "Nulos para las columnas: ['catalog_number']"],
        ['MCNB-Art', 'MZB 87-491', '-2', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '',
         'Invalid GBIF id: -2'],
        ['MCNB-Art', 'MZB 87-490', '3792', 'x', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '',
         'Coordenadas no válidas: (x,5)'],
        ['MCNB-Art', 'MZB 87-489', '3792', '117', 'y', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '',
         'Coordenadas no válidas: (117,y)']
    ]


@pytest.mark.django_db
def test_success_replacing_existing():
    # GIVEN
    csv = iter([
        ['collection_code', 'catalog_number', 'gbif_id', 'longitude', 'latitude', 'date', 'institution',
         'basisOfRecord', 'municipality', 'county', 'stateProvince'],
        ['MCNB-Art', 'MZB 87-4959', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', ''],
    ])
    num_occurrences = Occurrence.objects.count()
    well_known_occurrence = Occurrence.objects.get(catalog_number='MZB 87-4959')

    # WHEN
    errors = cut.persist_csv(csv)

    # THEN
    assert errors is None
    assert Occurrence.objects.count() == num_occurrences
    assert not Occurrence.objects.filter(id=well_known_occurrence.id).exists()
    assert Occurrence.objects.filter(catalog_number='MZB 87-4959').exists()
