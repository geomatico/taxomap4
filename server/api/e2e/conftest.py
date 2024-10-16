import pytest
from geomatico_django_test.database_aware_factory import DatabaseAwareFactory


@pytest.fixture(autouse=True)
def configure_django_db(request):
    DatabaseAwareFactory.configure_django_db(request)
