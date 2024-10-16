from uuid import UUID, uuid4

import pytest
from django.utils.timezone import now
from geomatico_django_test.view_tests import assert_error, delete, get, patch, post, put, to_http_date
from rest_framework.status import HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_412_PRECONDITION_FAILED
from rest_framework.test import APIClient

client = APIClient()

_SAMPLE_POSITION = {"type": "Point", "coordinates": [50.1234567890, 10.1234567890]}


@pytest.mark.django_db
class TestMerkaatViewById:
    def test_get_with_uuids_filter(self):
        # GIVEN
        uuid1 = uuid4()
        uuid2 = uuid4()

        # WHEN
        response = get(f"merkaats/?uuid={uuid1},{uuid2}")

        # THEN
        assert response.status_code == 200
        json = response.json()
        assert len(json) == 2
        assert [json[0]["uuid"], json[1]["uuid"]] == [str(uuid1), str(uuid2)]
        # responses are auto-generated on the fly with constants, there's no database for merkaats
        assert json[0]["weeAmount"] == 1000.0
        assert json[1]["weeAmount"] == 1000.0

    def test_get_without_filters(self):
        # WHEN
        response = get("merkaats/")

        # THEN
        assert_error(response, [("uuid", ["This field is required."])])

    def test_get_by_uuid(self):
        # GIVEN
        uuid = uuid4()

        # WHEN
        response = get(f"merkaats/{uuid}")

        # THEN
        assert response.status_code == HTTP_200_OK
        assert response.json()['uuid'] == str(uuid)
        assert response.json()['weeAmount'] == 1000.0

    def test_get_by_invalid_uuid(self):
        # WHEN
        response = get("merkaats/42")

        # THEN
        assert response.status_code == HTTP_400_BAD_REQUEST
        assert response.json()['detail'] == 'Cannot parse UUID: 42'

    def test_post_missing_properties(self):
        # GIVEN
        request = {}

        # WHEN
        response = post("merkaats/", request)

        # THEN
        assert_error(response, [("weeAmount", ["This field is required."])], )

    def test_post_success(self):
        # GIVEN
        request = {
            "weeAmount": 200,
            "zipMovements": [{
                "isUp": False,
                "speed": 10
            }, {
                "isUp": True,
                "speed": 5
            }]
        }

        # WHEN
        response = post("merkaats/", request)

        # THEN
        assert response.status_code == 201
        json = response.json()
        assert UUID(json["uuid"]).is_safe
        assert json["weeAmount"] == 200.0
        assert json["zipMovements"][0]["isUp"] is False
        assert json["zipMovements"][0]["speed"] == 10
        assert json["zipMovements"][1]["isUp"] is True
        assert json["zipMovements"][1]["speed"] == 5

    def test_put_incomplete(self):
        # GIVEN
        request = {}

        # WHEN
        response = put(f"merkaats/{uuid4()}", request)

        # THEN
        assert_error(response, [
            ("weeAmount", ["This field is required."])
        ])

    def test_put_read_only(self):
        # GIVEN
        request = {
            "uuid": uuid4(),
            "weeAmount": 200,
            "zipMovements": [{
                "isUp": False,
                "speed": 10
            }, {
                "isUp": True,
                "speed": 5
            }]
        }

        # WHEN
        response = put(f"merkaats/{uuid4()}", request)

        # THEN
        assert_error(response, [
            ("uuid", ["Field is read only."])
        ])

    def test_put_etag_does_not_match(self):
        # WHEN
        response = put(f"merkaats/{uuid4()}", {}, headers={"If-Match": '"1"'})

        # THEN will always fail since there's no entity with versioning
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_put_modified_since(self):
        # WHEN
        response = put(f"merkaats/{uuid4()}", {}, headers={"If-Unmodified-Since": to_http_date(now())})

        # THEN will always fail since there's no entity with versioning
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_put_success(self):
        # WHEN
        merkaat_uuid = uuid4()
        response = put(f"merkaats/{merkaat_uuid}", {
            "uuid": merkaat_uuid,
            "weeAmount": 2187.4,
            "weeLandingPoint": {
                "type": "Point",
                "coordinates": [0.1, 0.2]
            },
            "zipMovements": [{
                "isUp": False,
                "speed": 10
            }, {
                "isUp": True,
                "speed": 5
            }]
        })

        # THEN
        assert response.status_code == HTTP_200_OK
        json = response.json()
        assert UUID(json["uuid"]).is_safe
        assert json["weeAmount"] == 2187.4
        assert json["zipMovements"][0]["isUp"] is False
        assert json["zipMovements"][0]["speed"] == 10
        assert json["zipMovements"][1]["isUp"] is True
        assert json["zipMovements"][1]["speed"] == 5
        assert json["weeLandingPoint"]["type"] == "Point"
        assert json["weeLandingPoint"]["coordinates"] == [0.1, 0.2]

    def test_patch_read_only(self):
        # GIVEN
        request = {"uuid": uuid4()}

        # WHEN
        response = patch(f"merkaats/{uuid4()}", request)

        # THEN
        assert_error(response, [
            ("uuid", ["Field is read only."])
        ])

    def test_patch_etag_does_not_match(self):
        # WHEN
        response = patch(f"merkaats/{uuid4()}", {}, headers={"If-Match": '"1"'})

        # THEN will always fail since there's no entity with versioning
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_patch_modified_since(self):
        # WHEN
        response = patch(f"merkaats/{uuid4()}", {}, headers={"If-Unmodified-Since": to_http_date(now())})

        # THEN will always fail since there's no entity with versioning
        assert response.status_code == HTTP_412_PRECONDITION_FAILED

    def test_patch_success(self):
        # WHEN
        response = patch(f"merkaats/{uuid4()}", {
            "weeAmount": 2187.4,
            "weeLandingPoint": {
                "type": "Point",
                "coordinates": [0.1, 0.2]
            }
        })

        # THEN
        assert response.status_code == HTTP_200_OK
        assert response.json()['weeAmount'] == 2187.4

    def test_delete(self):
        # WHEN
        response = delete(f"merkaats/{uuid4()}")

        # THEN
        assert response.status_code == HTTP_204_NO_CONTENT
