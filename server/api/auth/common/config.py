from datetime import timedelta
from typing import Iterable


def configure_auth(
        module,
        user_model: str,
        login_field: str,
        user_serializer_class: str,
        password_hashers: Iterable[str] = None,
        password_validators: Iterable[dict] = None,
        access_token_lifetime: timedelta = timedelta(minutes=15),
        refresh_token_lifetime: timedelta = timedelta(days=7),

):
    module.AUTH_USER_MODEL = user_model
    module.INSTALLED_APPS.append('djoser')
    module.DJOSER = get_djoser_config(
        user_serializer_class=user_serializer_class,
        login_field=login_field
    )
    module.REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
    module.SIMPLE_JWT = get_simple_jwt_config(login_field, access_token_lifetime, refresh_token_lifetime)
    if password_hashers:
        module.PASSWORD_HASHERS = password_hashers
    if password_validators:
        module.AUTH_PASSWORD_VALIDATORS = password_validators


def get_djoser_config(user_serializer_class: str, login_field: str):
    return {
        'SEND_ACTIVATION_EMAIL': True,
        'LOGIN_FIELD': login_field,
        'GEOMATICO_BACKEND_BASE_PATH': '/api/v1/auth',
        'HIDE_USERS': False,
        'TOKEN_MODEL': None,
        # TODO deleted
        # 'PERMISSIONS': {
        #     'user': ['api.auth.permissions.UserPermission'],
        #     'user_list': ['rest_framework.permissions.AllowAny'],
        # },
        'SERIALIZERS': {
            'user_create': user_serializer_class,
            'user': user_serializer_class,
            'current_user': user_serializer_class,
            'user_delete': 'djoser.serializers.UserDeleteSerializer',
        }
    }


def get_simple_jwt_config(
        login_field: str,
        access_token_lifetime: timedelta = timedelta(minutes=15),
        refresh_token_lifetime: timedelta = timedelta(days=7)):
    return {
        'USER_ID_FIELD': login_field,
        'ALGORITHM': 'HS256',
        'AUTH_HEADER_TYPES': ('Bearer',),
        'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
        'ACCESS_TOKEN_LIFETIME': access_token_lifetime,
        'REFRESH_TOKEN_LIFETIME': refresh_token_lifetime,
        'UPDATE_LAST_LOGIN': True
    }
