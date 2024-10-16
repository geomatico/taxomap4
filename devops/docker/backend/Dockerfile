FROM ghcr.io/geomatico/django-service:12.0-base

WORKDIR /server

COPY ./server/ .

RUN pip install -r requirements/base.txt
RUN pip install gunicorn tzdata

ADD devops/docker/backend/scripts /usr/bin

ENV MEDIA_ROOT=/media
ENV STATIC_ROOT=/static
VOLUME $MEDIA_ROOT
VOLUME $STATIC_ROOT

EXPOSE 80

CMD "start.sh"
