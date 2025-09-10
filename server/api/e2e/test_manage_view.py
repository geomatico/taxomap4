import json
import os
from time import time

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
    ] if dictionary not in available_dictionaries]
    assert missing_dictionaries == []

    # just check some random data
    kingdom_path = os.path.join(settings.STATIC_ROOT, 'dictionaries/kingdom.json')
    assert os.path.getmtime(kingdom_path) > time() - 10  # modified less than 10s ago
    with open(kingdom_path) as kingdom_file:
        content = kingdom_file.read()
        kingdoms = json.loads(content)
        assert kingdoms == [
            {"id": 1, "name": "Animalia", "domain_id": 1},
            {"id": 6, "name": "Plantae", "domain_id": 1},
        ]


def _validate_arrow():
    arrow_path = os.path.join(settings.STATIC_ROOT, 'taxomap.arrow')
    assert os.path.getmtime(arrow_path) > time() - 10  # modified less than 10s ago
    assert os.path.getsize(arrow_path) > 7 * 1024 * 1024  # >15MB
