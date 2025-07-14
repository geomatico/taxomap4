import sys

from geomatico_django.settings.base import *

from api.auth.common.config import configure_auth

INSTALLED_APPS.append("api")

REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'api.auth.common.exceptions.custom_exception_handler'

configure_auth(
    sys.modules[__name__],
    user_model='api.User',
    login_field='email',
    user_serializer_class='api.auth.serialization.TaxomapUserSerializer',
)

DJOSER['PERMISSIONS'] = DJOSER['PERMISSIONS'] if 'PERMISSIONS' in DJOSER else {}
DJOSER['ACTIVATION_URL'] = '{uid}/{token}'
DJOSER['PASSWORD_RESET_CONFIRM_URL'] = '{uid}/{token}'
DJOSER['USERNAME_RESET_CONFIRM_URL'] = '{uid}/{token}'
DJOSER['PERMISSIONS']['username_reset'] = ['rest_framework.permissions.IsAdminUser']
DJOSER['PERMISSIONS']['username_reset_confirm'] = ['rest_framework.permissions.IsAdminUser']
DJOSER['PERMISSIONS']['set_username'] = ['rest_framework.permissions.IsAdminUser']
DJOSER['PERMISSIONS']['user_create'] = ['rest_framework.permissions.IsAdminUser']
DJOSER['PERMISSIONS']['user_delete'] = ['rest_framework.permissions.IsAdminUser']
DJOSER['PERMISSIONS']['user_list'] = ['rest_framework.permissions.IsAdminUser']

LANGUAGES = [
    ("ca", "Catalan"),
    ("es", "Spanish"),
    ("en", "English"),
]

GDAL_HOST = env('GDAL_HOST', default='taxomap-gdal')
GDAL_PORT = env('GDAL_PORT', default='22')
GDAL_PASSWORD = env('GDAL_PASSWORD', default='geoprocessing')
