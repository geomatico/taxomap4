from geomatico_django.types import EnumWithText
from rest_framework.exceptions import APIException
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import exception_handler


class BusinessError(EnumWithText):
    USER_EXISTS = ('USER_EXISTS', 'User with this email address already exists.')


class BusinessErrorException(APIException):
    status_code = HTTP_400_BAD_REQUEST

    def __init__(self, error: EnumWithText):
        self.detail = error.human_readable()
        self.business_error_code = error.text()


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and isinstance(exc, BusinessErrorException):
        response.data['businessErrorCode'] = exc.business_error_code
    return response
