from uuid import uuid4

import factory
import pytest
from geomatico_django_test.database_aware_factory import DatabaseAwareFactory

from api.dto.merkaat_serializer import MerkaatDto
from api.repositories.otter import Otter, OtterRepository


@pytest.fixture(autouse=True)
def configure_django_db(request):
    DatabaseAwareFactory._use_django_db = False


class MerkaatFactory(factory.Factory):
    class Meta:
        model = MerkaatDto

    uuid = factory.LazyFunction(uuid4)
    weeAmount = factory.Faker('pyfloat')


class OtterFactory(DatabaseAwareFactory):
    class Meta:
        model = Otter
        repository = OtterRepository

    slug = factory.Faker("slug")
    bath_time = factory.Faker('pyfloat')
