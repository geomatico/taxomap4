import csv
import io

from django.db import transaction, connection
from rest_framework.exceptions import ParseError
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.views import APIView


class UploadCsvView(APIView):
    parser_classes = [MultiPartParser, FileUploadParser]

    # curl http://localhost:8000/api/v1/upload-csv/ --form "data=@/tmp/data.csv
    @transaction.atomic
    def post(self, request):
        csv_reader = _parse_csv(request)
        _validate_header(next(csv_reader))
        _write_csv(csv_reader)
        return Response(status=HTTP_204_NO_CONTENT)


_HEADER = ['occurrenceID', 'institutionCode', 'collectionCode', 'basisOfRecord', 'catalogNumber', 'recordNumber',
           'recordedBy', 'individualCount', 'sex', 'lifeStage', 'preparations', 'associatedReferences',
           'otherCatalogNumbers', 'associatedOccurrences', 'previousIdentifications', 'fieldNumber', 'eventDate',
           'verbatimEventDate', 'habitat', 'establishmentMeans', 'samplingProtocol', 'eventRemarks', 'continent',
           'country', 'countryCode', 'stateProvince', 'county', 'municipality', 'locality', 'verbatimLocality',
           'waterBody', 'island', 'islandGroup', 'minimumElevationInMeters', 'maximumElevationInMeters',
           'minimumDepthInMeters', 'maximumDepthInMeters', 'decimalLatitude', 'decimalLongitude',
           'geodeticDatum', 'coordinateUncertaintyInMeters', 'verbatimCoordinates', 'identifiedBy',
           'dateIdentified', 'identificationQualifier', 'typeStatus', 'scientificName', 'kingdom', 'phylum',
           'class', 'order', 'family', 'genus', 'subgenus', 'specificEpithet', 'infraspecificEpithet',
           'scientificNameAuthorship', 'taxonRank']


def _parse_csv(request):
    try:
        content = request.FILES['data'].file.read().decode('UTF-8')
        return csv.reader(io.StringIO(content), delimiter=',')
    except BaseException as e:
        raise ParseError(e)


def _validate_header(header: list[str]) -> None:
    if header != _HEADER:
        raise ParseError('Invalid CSV.')


def _write_csv(csv_reader) -> None:
    with connection.cursor() as cursor:
        for row in csv_reader:
            cursor.execute(
                'insert into taxomap (institutioncode, basisofrecord, kingdom, phylum, class, "order", family, genus) '
                "values (%s, %s, %s, %s, %s, %s, %s, %s)", [
                    row[_HEADER.index('institutionCode')],
                    row[_HEADER.index('basisOfRecord')],
                    row[_HEADER.index('kingdom')],
                    row[_HEADER.index('phylum')],
                    row[_HEADER.index('class')],
                    row[_HEADER.index('order')],
                    row[_HEADER.index('family')],
                    row[_HEADER.index('genus')],
                ])
