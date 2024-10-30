import pytest
from geomatico_django_test.view_tests import get
from rest_framework.status import HTTP_200_OK, HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.parametrize("user", [
    {'is_staff': True},
    {'is_staff': False},
], ids=["staff", "regular user"], indirect=True)
def test_get_staff(user):
    # WHEN
    response = get('holi', user=user)

    # THEN
    assert response.status_code == HTTP_200_OK
    assert response.json() == 'holi'


@pytest.mark.django_db
def test_get_anonymous():
    # WHEN / THEN
    assert get('holi', user=None).status_code == HTTP_401_UNAUTHORIZED
