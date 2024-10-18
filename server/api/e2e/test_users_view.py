from datetime import datetime, timedelta

import pytest
from dateutil.parser import parse
from geomatico_django_test.view_tests import assert_error, delete, get, patch, post
from pytz import UTC
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
)

from api.models import User


@pytest.mark.django_db
def test_create_regular_user(regular_user):
    # WHEN / THEN
    assert post('auth/users/', data={}, user=regular_user).status_code == HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_create_anonymous():
    # WHEN / THEN
    assert post('auth/users/', data={}, user=None).status_code == HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_create_missing_properties(staff_user):
    # GIVEN
    data = {}

    # WHEN
    response = post('auth/users/', data=data, user=staff_user)

    # THEN
    assert_error(response, [
        ('firstName', ['This field is required.']),
        ('lastName', ['This field is required.']),
        ('email', ['This field is required.']),
        ('password', ['This field is required.']),
    ])


@pytest.mark.django_db
def test_create_existing_user(staff_user):
    # GIVEN
    data = _valid_post_request()
    data['email'] = staff_user.email

    # WHEN
    response = post('auth/users/', data=data, user=staff_user)

    # THEN
    assert response.status_code == HTTP_400_BAD_REQUEST
    assert response.json()['businessErrorCode'] == 'USER_EXISTS'


@pytest.mark.django_db
def test_create_success(admin_user):
    # GIVEN
    data = _valid_post_request()

    # WHEN
    response = post('auth/users/', data=data, user=admin_user)

    # THEN
    assert response.status_code == HTTP_201_CREATED

    json = response.json()
    assert json['id'] is not None
    assert json['firstName'] == data['firstName']
    assert json['lastName'] == data['lastName']
    assert json['email'] == data['email']
    assert 'password' not in json
    assert parse(json['registrationDate']) > datetime.now(UTC) - timedelta(milliseconds=500)
    created = User.objects.get(pk=json['id'])
    assert not created.is_active
    assert not created.is_staff


@pytest.mark.django_db
@pytest.mark.parametrize("user", [
    {'is_staff': True},
    {'is_staff': False},
], ids=["staff", "regular user"], indirect=True)
def test_get_me(user):
    # WHEN
    response = get('auth/users/me/', user=user)

    # THEN
    assert response.status_code == HTTP_200_OK
    json = response.json()
    assert json['id'] == user.id
    assert json['email'] == user.email
    assert json['firstName'] == user.first_name
    assert json['lastName'] == user.last_name
    assert parse(json['registrationDate']) < datetime.now(UTC)
    assert 'password' not in json


@pytest.mark.django_db
def test_get_another_user_staff(staff_user, regular_user):
    # WHEN
    response = get(f'auth/users/{regular_user.id}/', user=staff_user)

    # THEN
    assert response.status_code == HTTP_200_OK
    assert_user(response.json(), regular_user)


@pytest.mark.django_db
def test_get_another_user_regular_user(staff_user, regular_user):
    assert get(f'auth/users/{staff_user.id}/', user=regular_user).status_code == HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_list_users_staff(staff_user, regular_user):
    # WHEN
    response = get('auth/users/', user=staff_user)

    # THEN
    assert response.status_code == HTTP_200_OK
    json = response.json()
    assert len(json) == 2
    assert_user(json[0], staff_user)
    assert_user(json[1], regular_user)


@pytest.mark.django_db
def test_list_users_regular_user(regular_user):
    # WHEN / THEN
    assert get('auth/users/', user=regular_user).status_code == HTTP_403_FORBIDDEN


@pytest.mark.django_db
@pytest.mark.parametrize("user", [
    {'is_staff': True},
    {'is_staff': False},
], ids=["staff", "regular user"], indirect=True)
def test_patch_me_non_modifiable(user):
    # GIVEN
    request = {
        'email': 'another_email@gmail.com',
        'password': 'g_$.1sruhdfghlj243769182973',
    }

    # WHEN
    response = patch('auth/users/me/', data=request, user=user)

    # THEN
    assert response.status_code == HTTP_400_BAD_REQUEST
    assert_error(response, [
        ('email', 'email cannot be changed through this endpoint.'),
        ('password', 'password cannot be changed through this endpoint.'),
    ])


@pytest.mark.django_db
@pytest.mark.parametrize("user", [
    {'is_staff': True},
    {'is_staff': False},
], ids=["staff", "regular user"], indirect=True)
def test_patch_me(user):
    # GIVEN
    request = {
        'firstName': 'Another name',
    }

    # WHEN
    response = patch('auth/users/me/', data=request, user=user)

    # THEN
    assert response.status_code == HTTP_200_OK
    assert response.json()['firstName'] == 'Another name'


@pytest.mark.django_db
def test_patch_another_user_staff(staff_user, regular_user):
    # GIVEN
    request = {
        'firstName': 'Another name',
    }

    # WHEN
    response = patch(f'auth/users/{regular_user.id}/', data=request, user=staff_user)

    # THEN
    assert response.status_code == HTTP_200_OK
    assert response.json()['firstName'] == 'Another name'


@pytest.mark.django_db
def test_patch_another_user_regular_user(staff_user, regular_user):
    # GIVEN
    request = {
        'firstName': 'Another name',
    }

    # WHEN / THEN
    assert patch(f'auth/users/{staff_user.id}/', data=request, user=regular_user).status_code == HTTP_403_FORBIDDEN


@pytest.mark.django_db
@pytest.mark.parametrize("user", [
    {'is_staff': True},
    {'is_staff': False},
], ids=["staff", "regular user"], indirect=True)
def test_delete_me(user):
    # WHEN
    response = delete('auth/users/me/', data={'current_password': user.email}, user=user)

    # THEN
    assert response.status_code == HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_delete_another_user_staff(staff_user, regular_user):
    # WHEN
    response = delete(f'auth/users/{regular_user.id}/', data={'current_password': staff_user.email}, user=staff_user)

    # THEN
    assert response.status_code == HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_delete_another_user_regular_user(staff_user, regular_user):
    # WHEN
    response = delete(
        f'auth/users/{staff_user.id}/', data={'current_password': regular_user.email}, user=regular_user
    )

    # THEN
    assert response.status_code == HTTP_403_FORBIDDEN


def _valid_post_request() -> dict:
    return {
        'firstName': 'Alan',
        'lastName': 'or Steve',
        'password': 'g_$.1sruhdfghlj2437695',
        'email': 'alan@bbc.com',
    }


def assert_user(json: dict, user: User):
    assert json['id'] == user.id
    assert json['firstName'] == user.first_name
    assert json['lastName'] == user.last_name
    assert json['email'] == user.email
    assert 'password' not in json
    assert parse(json['registrationDate']) < datetime.now(UTC)
