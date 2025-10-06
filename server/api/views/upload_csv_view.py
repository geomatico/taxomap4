import csv
import io
import logging

from django.db import transaction
from rest_framework.exceptions import ParseError
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.renderers import BaseRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from api.services.csv_upload_service import persist_csv
from api.services.resources_service import generate_all_resources


class CsvUploadRenderer(BaseRenderer):
    media_type = 'text/csv'
    format = 'csv'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if not isinstance(data, list):
            return JSONRenderer().render(data)
        header = data.pop(0)
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=header + ['falloImportacion'])
        writer.writeheader()
        for row in data:
            row_dict = {}
            for i in range(len(header)):
                try:
                    row_dict[header[i]] = row[i]
                except IndexError:
                    row_dict[header[i]] = ''

            row_dict['falloImportacion'] = row[len(header)]
            writer.writerow(row_dict)
        return output.getvalue().encode('UTF-8')


class UploadCsvView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FileUploadParser]
    renderer_classes = [CsvUploadRenderer]

    # curl http://localhost:8000/api/v1/upload-csv/ --form "data=@/tmp/data.csv
    # not transactional; we need django to persist some data regarding gbif ancestors,
    # so the gdal container can generate the arrow file within this endpoint
    def post(self, request):
        csv_reader = _parse_csv(request)
        with transaction.atomic():
            errors = persist_csv(csv_reader)

        try:
            generate_all_resources()
        except BaseException:
            logging.error('Cannot generate resources a uploaded data.')
            return Response(data=errors, status=520)

        if not errors:
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            return Response(data=errors, status=HTTP_200_OK)


def _parse_csv(request):
    try:
        content = request.FILES['data'].file.read().decode('UTF-8')
        return csv.reader(io.StringIO(content), delimiter=',')
    except BaseException as e:
        raise ParseError(e)
