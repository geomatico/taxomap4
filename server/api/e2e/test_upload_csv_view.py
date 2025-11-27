import os

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.test import APIClient


def test_empty_file(admin_user):
    # WHEN / THEN
    assert _post_request(b'', admin_user).status_code == HTTP_400_BAD_REQUEST


def test_broken_file(admin_user):
    # WHEN / THEN
    assert _post_request(os.urandom(500), admin_user).status_code == HTTP_400_BAD_REQUEST


def _post_request(contents: bytes, admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)
    return client.post(
        "/api/v1/upload-csv/", format="multipart", data={'data': SimpleUploadedFile('data.csv', contents)}
    )
