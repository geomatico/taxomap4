from project.settings.base import *
from geomatico_django.settings.local import *

DATABASES = {
    "default": env.db(default=f"postgis://taxomap:taxomap@localhost:{env('TAXOMAP_DB_PORT', default="5432")}/taxomap")
}

STATIC_ROOT = env("STATIC_ROOT", default='/tmp/taxomap/static')
MEDIA_ROOT = env("MEDIA_ROOT", default='/tmp/taxomap/media')
