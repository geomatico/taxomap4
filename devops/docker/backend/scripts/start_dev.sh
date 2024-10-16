#!/usr/bin/env bash

pip install -r /server/requirements/dev*.txt

GUNICORN_EXTRA_OPTS="--reload" start.sh