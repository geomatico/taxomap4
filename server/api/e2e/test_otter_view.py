from geomatico_django_test.view_tests import assert_error, get, post
from rest_framework.status import HTTP_201_CREATED
from rest_framework.test import APIClient

from api.e2e.view_tests import EntityViewByIdTestMixin
from api.repositories.otter import Otter
from api.tests.conftest import OtterFactory

client = APIClient()

_SAMPLE_POSITION = {"type": "Point", "coordinates": [50.1234567890, 10.1234567890]}


class TestOtterView(EntityViewByIdTestMixin):
    factory = OtterFactory
    path = "otters"
    id_property = "slug"

    def test_get_all(self):
        # GIVEN
        otter_1 = OtterFactory()
        otter_2 = OtterFactory()

        # WHEN
        response = get("otters")

        # THEN
        assert response.status_code == 200
        json = response.json()
        assert len(json) == 2
        assert sorted([json[0]["slug"], json[1]["slug"]]) == sorted([otter_1.slug, otter_2.slug])
        assert sorted([json[0]["bathTime"], json[1]["bathTime"]]) == sorted([otter_1.bath_time, otter_2.bath_time])

    def test_post_missing_properties(self):
        # WHEN
        response = post("otters", {})

        # THEN
        assert_error(response, [
            ("slug", ["This field is required."]),
            ("bathTime", ["This field is required."])
        ])

    def test_post_success(self):
        # GIVEN
        request = {
            "slug": "happy-otter",
            "bathTime": 100.0
        }

        # WHEN
        response = post("otters", request)

        # THEN
        assert response.status_code == HTTP_201_CREATED
        json = response.json()
        assert json["slug"] == 'happy-otter'
        assert json["bathTime"] == 100.0

    def get_valid_patch_request(self, domain: Otter):
        return {"bathTime": 0.1}

    def validate_get_response_by_id(self, domain: Otter, response: dict):
        assert response["slug"] == domain.slug
        assert response["bathTime"] == domain.bath_time

    def validate_patch_response(self, domain: Otter, request: dict, response: dict):
        assert response["bathTime"] == 0.1

    def get_valid_put_request(self, domain: Otter = None):
        return {
            "slug": domain.slug,
            "bathTime": 0.5
        }

    def validate_put_response(self, domain: Otter, request: dict, response: dict):
        assert response["bathTime"] == 0.5
