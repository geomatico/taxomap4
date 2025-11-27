import pathlib

import pytest
from geomatico_django_test.database_aware_factory import DatabaseAwareFactory


@pytest.fixture(autouse=True)
def configure_django_db(request):
    DatabaseAwareFactory._use_django_db = False


def resource_path(resource):
    return pathlib.Path(__file__).parent / 'resources' / resource


def read_resource(resource) -> bytes:
    with open(resource_path(resource), 'rb') as file:
        return file.read()
