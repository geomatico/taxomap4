from abc import ABC, abstractmethod
from datetime import timedelta

import pytest
from geomatico_django_test.view_tests import (
    assert_error,
    assert_get_entity_by_id,
    delete,
    get,
    patch,
    put,
    to_http_date,
)
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_304_NOT_MODIFIED,
    HTTP_404_NOT_FOUND,
    HTTP_412_PRECONDITION_FAILED,
)


@pytest.mark.django_db
class EntityViewTestMixin:
    _path = None
    factory = None

    @property
    def path(self):
        if self._path is None:
            raise NotImplementedError("'path' must be set when using EntityViewTestMixin")
        return self._path

    @path.setter
    def path(self, new_path):
        self._path = new_path

    def new_domain(self):
        if self.factory is None:
            raise NotImplementedError("'factory' must be set when using EntityViewTestMixin")
        return self.factory()


class EntityViewGetByIdTestMixin(EntityViewTestMixin):
    id_property = 'id'

    def test_get_by_id_not_modified(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = get(
            f"{self.path}/{domain.pk}",
            headers={"If-Modified-Since": to_http_date(domain.updated_at)},
        )

        # THEN
        assert response.status_code == HTTP_304_NOT_MODIFIED
        assert response.headers["ETag"] == f'"{domain.entity_version}"'
        assert response.headers["Last-Modified"] == to_http_date(domain.updated_at)

    def test_get_by_id_modified(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = get(
            f"{self.path}/{domain.pk}",
            {"If-Modified-Since": to_http_date(domain.updated_at - timedelta(seconds=10))},
        )

        # THEN
        json = assert_get_entity_by_id(response, domain, self.id_property)
        self.validate_get_response_by_id(domain, json)

    def test_get_by_id_existing(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = get(f"{self.path}/{domain.pk}")

        # THEN
        json = assert_get_entity_by_id(response, domain, self.id_property)
        self.validate_get_response_by_id(domain, json)

    def test_get_by_id_not_existing(self):
        # WHEN
        response = get(f"{self.path}/200")

        # THEN
        assert response.status_code == HTTP_404_NOT_FOUND
        assert response.json()["detail"] == f"No {self.new_domain().get_entity_name()} for id: 200"

    def validate_get_response_by_id(self, domain, response: dict):
        """
        Make assertions based on the GET response.

        :param domain: The domain object.
        :param response: The dict representing the JSON response.
        """
        raise NotImplementedError("'validate_get_response_by_id() must be implemented.")


class EntityViewDeleteByIdTestMixin(EntityViewTestMixin):
    def test_delete_not_existing(self):
        # WHEN
        response = delete(f"{self.path}/200")

        # THEN
        assert response.status_code == HTTP_404_NOT_FOUND
        assert (
            response.json()["detail"]
            == f"No {self.new_domain().get_entity_name()} for id: 200"
        )

    def test_delete_etag_does_not_match(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = delete(f"{self.path}/{domain.pk}", headers={"If-Match": f'"{domain.entity_version - 1}"'})

        # THEN
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_delete_etag_matches(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = delete(f"{self.path}/{domain.pk}", headers={"If-Match": f'"{domain.entity_version}"'})

        # THEN
        assert response.status_code == HTTP_204_NO_CONTENT
        assert len(domain.__class__._meta.model.objects.filter(pk=domain.pk)) == 0

    def test_delete_modified_since(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = delete(
            f"{self.path}/{domain.pk}",
            headers={"If-Unmodified-Since": to_http_date(domain.updated_at - timedelta(seconds=10))},
        )

        # THEN
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_delete_not_modified_since(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = delete(
            f"{self.path}/{domain.pk}",
            headers={"If-Unmodified-Since": to_http_date(domain.updated_at)},
        )

        # THEN
        assert response.status_code == HTTP_204_NO_CONTENT
        assert len(domain.__class__._meta.model.objects.filter(pk=domain.pk)) == 0


class EntityViewPutByIdTestMixin(EntityViewTestMixin):
    id_property = 'id'

    def test_put_non_existing(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = put(f"{self.path}/200", self.get_valid_put_request(domain))

        # THEN
        assert response.status_code == HTTP_404_NOT_FOUND

    def test_put_read_only_different_value(self):
        # GIVEN
        domain = self.new_domain()
        request = self.get_valid_put_request(domain)
        request[self.id_property] = (domain.pk + 1) if isinstance(domain.pk, int) else (domain.pk + '1')

        # WHEN
        response = put(f"{self.path}/{domain.pk}", request)

        # THEN
        assert_error(response, [
            (self.id_property, ["Field is read only."])
        ])

    def test_put_read_only_same_value(self):
        # GIVEN
        domain = self.new_domain()
        request = self.get_valid_put_request(domain)
        request[self.id_property] = domain.pk

        # WHEN
        response = put(f"{self.path}/{domain.pk}", request)

        # THEN
        assert response.status_code == HTTP_200_OK

    def test_put_etag_does_not_match(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = put(
            f"{self.path}/{domain.pk}", {},
            headers={"If-Match": f'"{domain.entity_version - 1}"'}
        )

        # THEN
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_put_etag_matches(self):
        # GIVEN
        domain = self.new_domain()
        request = self.get_valid_put_request(domain)

        # WHEN
        response = put(
            f"{self.path}/{domain.pk}",
            request,
            headers={"If-Match": f'"{domain.entity_version}"'},
        )

        # THEN
        assert response.status_code == HTTP_200_OK
        self.validate_put_response(domain, request, response.json())

    def test_put_modified_since(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = put(
            f"{self.path}/{domain.pk}",
            {},
            headers={"If-Unmodified-Since": to_http_date(domain.updated_at - timedelta(seconds=10))},
        )

        # THEN
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_put_not_modified_since(self):
        # GIVEN
        domain = self.new_domain()
        request = self.get_valid_put_request(domain)

        # WHEN
        response = put(
            f"{self.path}/{domain.pk}",
            request,
            headers={"If-Unmodified-Since": to_http_date(domain.updated_at)},
        )

        # THEN
        assert response.status_code == HTTP_200_OK
        self.validate_put_response(domain, request, response.json())

    @abstractmethod
    def get_valid_put_request(self, domain=None):
        """
        :param domain: The domain object, in case it needs to be analyzed to prepare the put
        :return: a dict to use for updating the entity via PUT
        """

    @abstractmethod
    def validate_put_response(
            self, domain, request: dict, response: dict
    ):
        """
        Make assertions based on the PUT response.

        :param domain: The domain object.
        :param request: As obtained by ```get_valid_put_request```
        :param response: The dict representing the JSON response.
        """


class EntityViewPatchByIdTestMixin(EntityViewTestMixin):
    id_property = 'id'

    def test_patch_non_existing(self):
        # WHEN
        response = patch(f"{self.path}/200", {})

        # THEN
        assert response.status_code == HTTP_404_NOT_FOUND

    def test_patch_read_only_different_value(self):
        # GIVEN
        domain = self.new_domain()
        request = {self.id_property: ((domain.pk + 1) if isinstance(domain.pk, int) else (domain.pk + '1'))}

        # WHEN
        response = patch(f"{self.path}/{getattr(domain, self.id_property)}", request)

        # THEN
        assert_error(response, [
            (self.id_property, ["Field is read only."])
        ])

    def test_patch_read_only_same_value(self):
        # GIVEN
        domain = self.new_domain()
        request = {self.id_property: domain.pk}

        # WHEN
        response = patch(f"{self.path}/{domain.pk}", request)

        # THEN
        assert response.status_code == HTTP_200_OK

    def test_patch_etag_does_not_match(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = patch(
            f"{self.path}/{domain.pk}", {},
            headers={"If-Match": f'"{domain.entity_version - 1}"'}
        )

        # THEN
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_patch_etag_matches(self):
        # GIVEN
        domain = self.new_domain()
        request = self.get_valid_patch_request(domain)

        # WHEN
        response = patch(
            f"{self.path}/{domain.pk}",
            request,
            {"If-Match": f'"{domain.entity_version}"'},
        )

        # THEN
        assert response.status_code == HTTP_200_OK
        self.validate_patch_response(domain, request, response.json())

    def test_patch_modified_since(self):
        # GIVEN
        domain = self.new_domain()

        # WHEN
        response = patch(
            f"{self.path}/{domain.pk}",
            {},
            headers={"If-Unmodified-Since": to_http_date(domain.updated_at - timedelta(seconds=10))},
        )

        # THEN
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_patch_not_modified_since(self):
        # GIVEN
        domain = self.new_domain()
        request = self.get_valid_patch_request(domain)

        # WHEN
        response = patch(
            f"{self.path}/{domain.pk}",
            request,
            {"If-Unmodified-Since": to_http_date(domain.updated_at)},
        )

        # THEN
        assert response.status_code == HTTP_200_OK
        self.validate_patch_response(domain, request, response.json())

    def get_valid_patch_request(self, domain=None):
        """
        :param domain: The domain object, in case it needs to be analyzed to prepare the patch
        :return: a dict to use for updating the entity via PATCH
        """
        raise NotImplementedError("'get_valid_patch_request() must be implemented.")

    @abstractmethod
    def validate_patch_response(self, domain, request: dict, response: dict):
        """
        Make assertions based on the PATCH response.

        :param domain: The domain object.
        :param request: As obtained by ```get_valid_patch_request```
        :param response: The dict representing the JSON response.
        """


class EntityViewByIdTestMixin(
    EntityViewGetByIdTestMixin,
    EntityViewDeleteByIdTestMixin,
    EntityViewPutByIdTestMixin,
    EntityViewPatchByIdTestMixin,
    ABC
):
    """
    Utility mixin for all GET/DELETE/PATCH by identifier.
    """
