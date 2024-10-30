import logging

import requests
from django.conf import settings
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


class DebugAuthView(APIView):
    """
    Just for debugging purposes when frontend is not there (testing with Postman alone, etc.).
    It simply forwards the GET sent by email with uid/token to the corresponding POST endpoint by djoser.
    """
    permission_classes = [permissions.AllowAny]
    forward_path = None

    def get(self, request, uid, token):
        protocol = "https://" if request.is_secure() else "http://"
        base_url = protocol + request.get_host() + settings.DJOSER['GEOMATICO_BACKEND_BASE_PATH']
        activation_url = base_url + self.forward_path

        payload = {"uid": uid, "token": token}
        self.fill_payload(request, payload)
        result = requests.post(activation_url, data=payload)

        if result.status_code == 204:
            return Response(status=204)
        else:
            logger.error(result.content)
            data = result.json() if result.headers['content-type'].startswith('application/json') else result.content
            return Response(status=result.status_code, data=data, headers=result.headers)

    def fill_payload(self, request, payload):
        return payload


class DebugUserActivationView(DebugAuthView):
    forward_path = '/users/activation/'


class DebugResetPasswordView(DebugAuthView):
    """
    For debugging purposes, it automatically forwards the GET request (sent as email to reset password)
    to the corresponding POST djoser endpoint.

    Query param 'new_password' can be used to set the new password. It defaults to 'metagato'.
    """
    forward_path = '/users/reset_password_confirm/'

    def fill_payload(self, request, payload):
        payload['new_password'] = request.query_params['new_password'] \
            if 'new_password' in request.query_params else 'metagato'


class DebugResetEmailView(DebugAuthView):
    """
    For debugging purposes, it automatically forwards the GET request (sent as email to reset email)
    to the corresponding POST djoser endpoint.

    Query param 'new_email' can be used to set the new password. It defaults to 'metagato@geomatico.es'.
    """
    forward_path = '/users/reset_email_confirm/'

    def fill_payload(self, request, payload):
        payload['new_email'] = request.query_params['new_email'] \
            if 'new_email' in request.query_params else 'metagato@geomatico.es'
