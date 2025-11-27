import json
import os
from time import time
from typing import Callable

import pytest
from django.conf import settings
from geomatico_django_test.view_tests import post
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN


# this test involves the communication with the gdal container via database,
# so we need to make sure we persist whatever we write during the execution
@pytest.mark.django_db(transaction=True)
def test_generate_resources(staff_user):
    # WHEN
    response = post('manage/generate-resources', {}, user=staff_user)

    # THEN
    assert response.status_code == HTTP_204_NO_CONTENT
    _validate_dictionaries()
    _validate_arrow()


@pytest.mark.django_db
def test_generate_resources_permissions(regular_user):
    assert post('manage/generate-resources', {}, user=None).status_code == HTTP_401_UNAUTHORIZED
    assert post('manage/generate-resources', {}, user=regular_user).status_code == HTTP_403_FORBIDDEN


def _validate_dictionaries():
    available_dictionaries = os.listdir(os.path.join(settings.STATIC_ROOT, 'dictionaries'))
    missing_dictionaries = [dictionary for dictionary in [
        'domain.json',
        'kingdom.json',
        'phylum.json',
        'class.json',
        'order.json',
        'family.json',
        'genus.json',
        'species.json',
        'subspecies.json',
        'basisofrecord.json',
        'institutioncode.json',
    ] if dictionary not in available_dictionaries]
    assert missing_dictionaries == []

    # just check some random data
    def validate_kingdoms(kingdoms):
        assert kingdoms == [
            {"id": 1, "name": "Animalia", "domain_id": 1},
            {"id": 6, "name": "Plantae", "domain_id": 1},
        ]

    def validate_basis_of_records(basis_of_record):
        assert basis_of_record == [
            {'code': 'FOSSIL', 'id': 1, 'name_ca': 'Fòssil', 'name_en': 'Fossil', 'name_es': 'Fósil'},
            {'code': 'NON_FOSSIL', 'id': 2, 'name_ca': 'No fòssil', 'name_en': 'Non-fossil', 'name_es': 'No fósil'}]

    def validate_institutions(institutions):
        assert institutions == [
            {'code': 'IMEDEA', 'id': 1,
             'name_ca': "Institut Mediterrani d'Estudis Avançats",
             'name_en': 'Mediterranean Institute for Advanced Studies',
             'name_es': 'Instituto Mediterráneo de Estudios Avanzados'},
            {'code': 'MCNB', 'id': 2,
             'name_ca': 'Museu Ciències Naturals Barcelona',
             'name_en': 'Museum of Natural Sciences of Barcelona',
             'name_es': 'Museo de Ciencias Naturales de Barcelona'},
            {'code': 'MVHN', 'id': 3,
             'name_ca': "Museu Valencià d'Història Natural",
             'name_en': 'Natural History Museum of Valencia',
             'name_es': 'Museo Valenciano de Historia Natural'},
            {'code': 'UB', 'id': 4,
             'name_ca': 'Universitat de Barcelona',
             'name_en': 'University of Barcelona',
             'name_es': 'Universidad de Barcelona'},
            {'code': 'IBB', 'id': 5,
             'name_ca': 'Institut Botànic de Barcelona',
             'name_en': 'Botanical Institute of Barcelona',
             'name_es': 'Instituto Botánico de Barcelona'}
        ]

    _validate_dictionary('kingdom.json', validate_kingdoms)
    _validate_dictionary('basisofrecord.json', validate_basis_of_records)
    _validate_dictionary('institutioncode.json', validate_institutions)


def _validate_arrow():
    arrow_path = os.path.join(settings.STATIC_ROOT, 'taxomap.arrow')
    assert os.path.getmtime(arrow_path) > time() - 10  # modified less than 10s ago
    assert os.path.getsize(arrow_path) > 7 * 1024 * 1024  # >15MB


def _validate_dictionary(filename: str, validate_contents: Callable):
    dictionary_path = os.path.join(settings.STATIC_ROOT, f'dictionaries/{filename}')
    assert os.path.getmtime(dictionary_path) > time() - 10  # modified less than 10s ago
    with open(dictionary_path) as dictionary_file:
        content = dictionary_file.read()
        validate_contents(json.loads(content))
