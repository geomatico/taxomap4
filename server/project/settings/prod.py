from .base import *

DEBUG = False
ALLOWED_HOSTS = [env("DJANGO_ALLOWED_HOSTS")]
CSRF_TRUSTED_ORIGINS = [f"https://{env("DJANGO_ALLOWED_HOSTS")}", f"http://{env("DJANGO_ALLOWED_HOSTS")}"]

STATIC_ROOT = env("STATIC_ROOT")
MEDIA_ROOT = env("MEDIA_ROOT")

SECRET_KEY = env("SECRET_KEY")

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {
        "handlers": ["console"],
        "level": env("DJANGO_LOG_LEVEL", default="INFO"),
        "propagate": True,
    }
}

DOMAIN = env('DOMAIN')