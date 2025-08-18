#!/usr/bin/env bash

python3 manage.py migrate
python3 manage.py collectstatic --noinput

if [ -n "${DJANGO_SUPERUSER_PASSWORD}" ]; then
  python3 manage.py createsuperuser --email info@geomatico.es --first_name geomatico --noinput
fi

if [ -z "${GUNICORN_LOG_LEVEL}" ]; then
  GUNICORN_LOG_LEVEL="info"
fi
if [ -z "${GUNICORN_N_WORKERS}" ]; then
  GUNICORN_N_WORKERS=2
fi
if [ -z "${GUNICORN_N_THREADS}" ]; then
  GUNICORN_N_THREADS=2
fi

gunicorn --workers=${GUNICORN_N_WORKERS} --threads=${GUNICORN_N_THREADS} ${GUNICORN_EXTRA_OPTS} --capture-output --log-level "${GUNICORN_LOG_LEVEL}" project.wsgi:application -b 0.0.0.0:80
