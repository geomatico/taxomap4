import pytest
from django.db.backends.base import creation
from geomatico_django_test.database_aware_factory import DatabaseAwareFactory

from api.models import User

creation.TEST_DATABASE_PREFIX = ''


@pytest.fixture
def staff_user():
    return User.objects.create_user(email='admin@geomatico.es', password='admin@geomatico.es', is_staff=True)


@pytest.fixture
def regular_user():
    return User.objects.create_user(email='user@geomatico.es', password='user@geomatico.es', is_staff=False)


@pytest.fixture
def user(request):
    is_staff = request.param['is_staff']
    email = 'admin@geomatico.es' if is_staff else 'user@geomatico.es'
    return User.objects.create_user(email=email, password=email, is_staff=is_staff)


@pytest.fixture(autouse=True)
def configure_django_db(request):
    DatabaseAwareFactory.configure_django_db(request)
