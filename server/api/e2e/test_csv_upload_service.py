import csv

import pytest
from rest_framework.exceptions import ParseError

from api.repositories.occurrence import Occurrence
from api.services import csv_upload_service as cut
from api.tests.conftest import resource_path


@pytest.mark.django_db
def test_missing_columns():
    # GIVEN
    csv = iter([
        ['collectionCode', 'catalogNumber', 'taxonID'],
        ['MCNB-Art', 'MZB 87-490', '3792'],
        ['MCNB-Art', 'MZB 87-489', '3792'],
    ])

    # WHEN
    with pytest.raises(ParseError) as e:
        cut.persist_csv(csv)

    # THEN
    assert e.value.detail == (
        "Invalid CSV. Missing columns: ['decimalLatitude', 'decimalLongitude', 'eventDate', "
        "'institutionCode', 'basisOfRecord', 'countryCode', 'municipality', 'county', 'stateProvince']"
    )


@pytest.mark.django_db
def test_ejemplo_fake_lines():
    # GIVEN
    with open(resource_path('ejemplo-fake-taxomap.csv'), 'r') as file:
        contents = csv.reader(file, delimiter=',')

        # WHEN
        errors = cut.persist_csv(contents)

        # THEN
        # they are not in our test data
        assert errors == [
            ['institutionCode', 'collectionCode', 'catalogNumber', 'basisOfRecord', 'taxonID', 'decimalLatitude',
             'decimalLongitude', 'eventDate', 'countryCode', 'stateProvince', 'county', 'municipality'],
            ['MCNB', 'BOT', 'BOT-0123', 'NON_FOSSIL', '2882316', '41.7667', '2.4500', '2001-08-23', 'ES', 'Catalunya',
             'Barcelona', 'Fogars de Montclús', 'Identificador GBIF inválido: 2882316'],
            ['MVHN', 'GEO', 'GEO-0456', 'FOSSIL', '4813103', '-34.6037', '-58.3816', '1975-03-04', 'AR', 'Buenos Aires',
             'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Identificador GBIF inválido: 4813103'],
            ['IBB', 'ENT', 'ENT-0999', 'NON_FOSSIL', '2163352', '41.3870', '2.1700', '1998-09-10', 'ES', 'Catalunya',
             'Barcelona', 'Barcelona', 'Identificador GBIF inválido: 2163352']
        ]


@pytest.mark.django_db
def test_success_with_some_errors():
    # GIVEN
    csv = iter([
        ['collectionCode', 'catalogNumber', 'taxonID', 'decimalLongitude', 'decimalLatitude', 'eventDate',
         'institutionCode', 'basisOfRecord', 'countryCode', 'municipality', 'county', 'stateProvince'],
        ['MCNB-Art', 'MZB 87-4959', '3792', '117', '5', '1995-05-20', 'MCNB', 'FOSSIL', 'ES', '', '', ''],
        ['MCNB-Art', 'MZB 87-496', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', ''],
        ['MCNB-Art', 'MZB 87-495', '3792', '117', '5', '2025-05-20', 'MCNB', 'BOB', '', '', '', ''],
        ['MCNB-Art', 'MZB 87-494', '3792', '117', '5', '2025-05-20', 'BOB', 'FOSSIL', '', '', '', ''],
        ['MCNB-Art', 'MZB 87-493', '3792', '117', '5', '2025', 'MCNB', 'FOSSIL', '', '', '', ''],
        ['', 'MZB 87-492', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', ''],
        ['MCNB-Art', '', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', ''],
        ['MCNB-Art', 'MZB 87-491', '-2', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', ''],
        ['MCNB-Art', 'MZB 87-490', '3792', 'x', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', ''],
        ['MCNB-Art', 'MZB 87-489', '3792', '117', 'y', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', ''],
        ['MCNB-Art', 'MZB 87-4959', '3792', '117', '5', '1995-05-20', 'MCNB', 'FOSSIL', 'wrong_country', '', '', ''],
    ])

    # WHEN
    errors = cut.persist_csv(csv)

    # THEN
    assert errors == [
        ['collectionCode', 'catalogNumber', 'taxonID', 'decimalLongitude', 'decimalLatitude', 'eventDate',
         'institutionCode', 'basisOfRecord', 'countryCode', 'municipality', 'county', 'stateProvince'],
        ['MCNB-Art', 'MZB 87-495', '3792', '117', '5', '2025-05-20', 'MCNB', 'BOB', '', '', '', '',
         'basisOfRecord inválido: BOB'],
        ['MCNB-Art', 'MZB 87-494', '3792', '117', '5', '2025-05-20', 'BOB', 'FOSSIL', '', '', '', '',
         'Institución inválida: BOB'],
        ['MCNB-Art', 'MZB 87-493', '3792', '117', '5', '2025', 'MCNB', 'FOSSIL', '', '', '', '',
         'Fecha no válida (ISO8601 YYYY-MM-DD): 2025'],
        ['MCNB-Art', '', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', '',
         "Las siguientes columnas obligatorias están vacías: ['catalogNumber']"],
        ['MCNB-Art', 'MZB 87-491', '-2', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', '',
         'Identificador GBIF inválido: -2'],
        ['MCNB-Art', 'MZB 87-490', '3792', 'x', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', '',
         'Coordenadas no válidas: (x,5)'],
        ['MCNB-Art', 'MZB 87-489', '3792', '117', 'y', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', '',
         'Coordenadas no válidas: (117,y)'],
        ['MCNB-Art', 'MZB 87-4959', '3792', '117', '5', '1995-05-20', 'MCNB', 'FOSSIL', 'wrong_country', '', '', '',
         'Código de país inválido: wrong_country'],
    ]


@pytest.mark.django_db
def test_success_replacing_existing():
    # GIVEN
    csv = iter([
        ['collectionCode', 'catalogNumber', 'taxonID', 'decimalLongitude', 'decimalLatitude', 'eventDate',
         'institutionCode', 'basisOfRecord', 'countryCode', 'municipality', 'county', 'stateProvince'],
        ['MCNB-Art', 'MZB 87-4959', '3792', '117', '5', '2025-05-20', 'MCNB', 'FOSSIL', '', '', '', ''],
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
