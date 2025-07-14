import csv
import io
from typing import Optional

from django.db import connection, transaction
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
        domain_id_by_value = _get_id_by_value_dict(cursor, 'domain')
        kingdom_id_by_value = _get_id_by_value_dict(cursor, 'kingdom')
        phylum_id_by_value = _get_id_by_value_dict(cursor, 'phylum')
        class_id_by_value = _get_id_by_value_dict(cursor, 'class')
        order_id_by_value = _get_id_by_value_dict(cursor, 'order')
        family_id_by_value = _get_id_by_value_dict(cursor, 'family')
        genus_id_by_value = _get_id_by_value_dict(cursor, 'genus')
        species_id_by_value = _get_id_by_value_dict(cursor, 'species')
        subspecies_id_by_value = _get_id_by_value_dict(cursor, 'subspecies')
        basis_of_record_id_by_value = _get_id_by_value_dict(cursor, 'basisofrecord')
        institution_code_id_by_value = _get_id_by_value_dict(cursor, 'institutioncode')
        for row in csv_reader:
            year, month, day = _parse_date(_get_value(row, 'eventDate'))

            latitude = _get_value(row, 'decimalLatitude')
            longitude = _get_value(row, 'decimalLongitude')
            geometry_wkt = None
            try:
                if -90 < float(latitude) < 90 and -180 < float(longitude) < 180:
                    geometry_wkt = f'POINT({longitude} {latitude})'
            except BaseException:
                ...

            # noinspection SqlDialectInspection
            cursor.execute(
                'insert into taxomap ('
                'geom,'
                'occurrenceid,'
                'institutioncode,'
                'collectioncode,'
                'basisofrecord,'
                'catalognumber,'
                'recordnumber,'
                'recordedby,'
                'individualcount,'
                'sex,'
                'lifestage,'
                'preparations,'
                'associatedreferences,'
                'othercatalognumbers,'
                'associatedoccurrences,'
                'previousidentifications,'
                'fieldnumber,'
                'eventdate,'
                'verbatimeventdate,'
                'habitat,'
                'establishmentmeans,'
                'samplingprotocol,'
                'eventremarks,'
                'continent,'
                'country,'
                'countrycode,'
                'stateprovince,'
                'county,'
                'municipality,'
                'locality,'
                'verbatimlocality,'
                'waterbody,'
                'island,'
                'islandgroup,'
                'minimumelevationinmeters,'
                'maximumelevationinmeters,'
                'minimumdepthinmeters,'
                'maximumdepthinmeters,'
                'decimallatitude,'
                'decimallongitude,'
                'geodeticdatum,'
                'coordinateuncertaintyinmeters,'
                'verbatimcoordinates,'
                'identifiedby,'
                'dateidentified,'
                'identificationqualifier,'
                'typestatus,'
                'scientificname,'
                'kingdom,'
                'phylum,'
                'class,'
                '"order",'
                'family,'
                'genus,'
                'subgenus,'
                'specificepithet,'
                'infraspecificepithet,'
                'scientificnameauthorship,'
                'taxonrank,'
                'year,'
                'month,'
                'day,'
                'domain,'
                'species,'
                'subspecies,'
                'familyid,'
                'genusid,'
                'speciesid,'
                'subspeciesid,'
                'gid,'
                'domain_id,'
                'kingdom_id,'
                'phylum_id,'
                'class_id,'
                'order_id,'
                'family_id,'
                'genus_id,'
                'species_id,'
                'subspecies_id,'
                'basisofrecord_id,'
                'institutioncode_id'
                ') '
                "values ("
                "ST_GeomFromText(%s),"  # 'geom,'
                "%s,"  # 'occurrenceid,'
                "%s,"  # 'institutioncode,'
                "%s,"  # 'collectioncode,'
                "%s,"  # 'basisofrecord,'
                "%s,"  # 'catalognumber,'
                "%s,"  # 'recordnumber,'
                "%s,"  # 'recordedby,'
                "%s,"  # 'individualcount,'
                "%s,"  # 'sex,'
                "%s,"  # 'lifestage,'
                "%s,"  # 'preparations,'
                "%s,"  # 'associatedreferences,'
                "%s,"  # 'othercatalognumbers,'
                "%s,"  # 'associatedoccurrences,'
                "%s,"  # 'previousidentifications,'
                "%s,"  # 'fieldnumber,'
                "%s,"  # 'eventdate,'
                "%s,"  # 'verbatimeventdate,'
                "%s,"  # 'habitat,'
                "%s,"  # 'establishmentmeans,'
                "%s,"  # 'samplingprotocol,'
                "%s,"  # 'eventremarks,'
                "%s,"  # 'continent,'
                "%s,"  # 'country,'
                "%s,"  # 'countrycode,'
                "%s,"  # 'stateprovince,'
                "%s,"  # 'county,'
                "%s,"  # 'municipality,'
                "%s,"  # 'locality,'
                "%s,"  # 'verbatimlocality,'
                "%s,"  # 'waterbody,'
                "%s,"  # 'island,'
                "%s,"  # 'islandgroup,'
                "%s,"  # 'minimumelevationinmeters,'
                "%s,"  # 'maximumelevationinmeters,'
                "%s,"  # 'minimumdepthinmeters,'
                "%s,"  # 'maximumdepthinmeters,'
                "%s,"  # 'decimallatitude,'
                "%s,"  # 'decimallongitude,'
                "%s,"  # 'geodeticdatum,'
                "%s,"  # 'coordinateuncertaintyinmeters,'
                "%s,"  # 'verbatimcoordinates,'
                "%s,"  # 'identifiedby,'
                "%s,"  # 'dateidentified,'
                "%s,"  # 'identificationqualifier,'
                "%s,"  # 'typestatus,'
                "%s,"  # 'scientificname,'
                "%s,"  # 'kingdom,'
                "%s,"  # 'phylum,'
                "%s,"  # 'class,'
                "%s,"  # '"order",'
                "%s,"  # 'family,'
                "%s,"  # 'genus,'
                "%s,"  # 'subgenus,'
                "%s,"  # 'specificepithet,'
                "%s,"  # 'infraspecificepithet,'
                "%s,"  # 'scientificnameauthorship,'
                "%s,"  # 'taxonrank,'
                "%s,"  # 'year,'
                "%s,"  # 'month,'
                "%s,"  # 'day,'
                "%s,"  # 'domain,'
                "%s,"  # 'species,'
                "%s,"  # 'subspecies,'
                "%s,"  # 'familyid,'
                "%s,"  # 'genusid,'
                "%s,"  # 'speciesid,'
                "%s,"  # 'subspeciesid,'
                "%s,"  # 'gid,'
                "%s,"  # 'domain_id,'
                "%s,"  # 'kingdom_id,'
                "%s,"  # 'phylum_id,'
                "%s,"  # 'class_id,'
                "%s,"  # 'order_id,'
                "%s,"  # 'family_id,'
                "%s,"  # 'genus_id,'
                "%s,"  # 'species_id,'
                "%s,"  # 'subspecies_id,'
                "%s,"  # 'basisofrecord_id,'
                "%s"  # 'institutioncode_id,'
                ")", [
                    geometry_wkt,  # 'geom,'
                    _get_value(row, 'occurrenceID'),  # 'occurrenceid,'
                    _get_value(row, 'institutionCode'),  # 'institutioncode,'
                    _get_value(row, 'collectionCode'),  # 'collectioncode,'
                    _get_value(row, 'basisOfRecord'),  # 'basisofrecord,'
                    _get_value(row, 'catalogNumber'),  # 'catalognumber,'
                    _get_value(row, 'recordNumber'),  # 'recordnumber,'
                    _get_value(row, 'recordedBy'),  # 'recordedby,'
                    _get_value(row, 'individualCount'),  # 'individualcount,'
                    _get_value(row, 'sex'),  # 'sex,'
                    _get_value(row, 'lifeStage'),  # 'lifestage,'
                    _get_value(row, 'preparations'),  # 'preparations,'
                    _get_value(row, 'associatedReferences'),  # 'associatedreferences,'
                    _get_value(row, 'otherCatalogNumbers'),  # 'othercatalognumbers,'
                    _get_value(row, 'associatedOccurrences'),  # 'associatedoccurrences,'
                    _get_value(row, 'previousIdentifications'),  # 'previousidentifications,'
                    _get_value(row, 'fieldNumber'),  # 'fieldnumber,'
                    _get_value(row, 'eventDate'),  # 'eventdate,'
                    _get_value(row, 'verbatimEventDate'),  # 'verbatimeventdate,'
                    _get_value(row, 'habitat'),  # 'habitat,'
                    _get_value(row, 'establishmentMeans'),  # 'establishmentmeans,'
                    _get_value(row, 'samplingProtocol'),  # 'samplingprotocol,'
                    _get_value(row, 'eventRemarks'),  # 'eventremarks,'
                    _get_value(row, 'continent'),  # 'continent,'
                    _get_value(row, 'country'),  # 'country,'
                    _get_value(row, 'countryCode'),  # 'countrycode,'
                    _get_value(row, 'stateProvince'),  # 'stateprovince,'
                    _get_value(row, 'county'),  # 'county,'
                    _get_value(row, 'municipality'),  # 'municipality,'
                    _get_value(row, 'locality'),  # 'locality,'
                    _get_value(row, 'verbatimLocality'),  # 'verbatimlocality,'
                    _get_value(row, 'waterBody'),  # 'waterbody,'
                    _get_value(row, 'island'),  # 'island,'
                    _get_value(row, 'islandGroup'),  # 'islandgroup,'
                    _get_value(row, 'minimumElevationInMeters'),  # 'minimumelevationinmeters,'
                    _get_value(row, 'maximumElevationInMeters'),  # 'maximumelevationinmeters,'
                    _get_value(row, 'minimumDepthInMeters'),  # 'minimumdepthinmeters,'
                    _get_value(row, 'maximumDepthInMeters'),  # 'maximumdepthinmeters,'
                    _get_value(row, 'decimalLatitude'),  # 'decimallatitude,'
                    _get_value(row, 'decimalLongitude'),  # 'decimallongitude,'
                    _get_value(row, 'geodeticDatum'),  # 'geodeticdatum,'
                    _get_value(row, 'coordinateUncertaintyInMeters'),  # 'coordinateuncertaintyinmeters,'
                    _get_value(row, 'verbatimCoordinates'),  # 'verbatimcoordinates,'
                    _get_value(row, 'identifiedBy'),  # 'identifiedby,'
                    _get_value(row, 'dateIdentified'),  # 'dateidentified,'
                    _get_value(row, 'identificationQualifier'),  # 'identificationqualifier,'
                    _get_value(row, 'typeStatus'),  # 'typestatus,'
                    _get_value(row, 'scientificName'),  # 'scientificname,'
                    _get_value(row, 'kingdom'),  # 'kingdom,'
                    _get_value(row, 'phylum'),  # 'phylum,'
                    _get_value(row, 'class'),  # 'class,'
                    _get_value(row, 'order'),  # '"order",'
                    _get_value(row, 'family'),  # 'family,'
                    _get_value(row, 'genus'),  # 'genus,'
                    _get_value(row, 'subgenus'),  # 'subgenus,'
                    _get_value(row, 'specificEpithet'),  # 'specificepithet,'
                    _get_value(row, 'infraspecificEpithet'),  # 'infraspecificepithet,'
                    _get_value(row, 'scientificNameAuthorship'),  # 'scientificnameauthorship,'
                    _get_value(row, 'taxonRank'),  # 'taxonrank,'
                    year,  # 'year,'
                    month,  # 'month,'
                    day,  # 'day,'
                    'Eukaryota',  # 'domain,'
                    _get_value(row, 'specificEpithet'),  # 'species,'
                    _get_value(row, 'infraspecificEpithet'),  # 'subspecies,'
                    family_id_by_value.get(_get_value(row, 'family'), None),  # 'familyid,'
                    genus_id_by_value.get(_get_value(row, 'genus'), None),  # 'genusid,'
                    species_id_by_value.get(_get_value(row, 'specificEpithet'), None),  # 'speciesid,'
                    subspecies_id_by_value.get(_get_value(row, 'infraspecificEpithet'), None),  # 'subspeciesid,'
                    0,  # 'gid,'
                    domain_id_by_value.get('Eukaryota'),  # 'domain_id,'
                    kingdom_id_by_value.get(_get_value(row, 'kingdom'), None),  # 'kingdom_id,'
                    phylum_id_by_value.get(_get_value(row, 'phylum'), None),  # 'phylum_id,'
                    class_id_by_value.get(_get_value(row, 'class'), None),  # 'class_id,'
                    order_id_by_value.get(_get_value(row, 'order'), None),  # 'order_id,'
                    family_id_by_value.get(_get_value(row, 'family'), None),  # 'family_id,'
                    genus_id_by_value.get(_get_value(row, 'genus'), None),  # 'genus_id,'
                    species_id_by_value.get(_get_value(row, 'specificEpithet'), None),  # 'species_id,'
                    subspecies_id_by_value.get(_get_value(row, 'infraspecificEpithet'), None),  # 'subspecies_id,'
                    basis_of_record_id_by_value.get(_get_value(row, 'basisOfRecord'), None),  # 'basisofrecord_id,'
                    institution_code_id_by_value.get(_get_value(row, 'institutionCode'), None),  # 'institutioncode_id'
                ])


def _parse_date(date: str) -> tuple[Optional[int], Optional[int], Optional[int]]:
    if not date:
        return None, None, None

    try:
        parts = [int(part) for part in date.split('-')]
    except BaseException:
        # TODO there might be other formats
        return None, None, None
    if len(parts) == 0:
        return None, None, None
    elif len(parts) == 1 and parts[0] > 1900:
        return parts[0], None, None
    elif (len(parts) == 2
          and parts[0] > 1900
          and 0 < parts[1] < 13):
        return parts[0], parts[1], None
    elif (len(parts) == 3
          and int(parts[0]) > 1900
          and 0 < int(parts[1]) < 13
          and 0 < int(parts[2]) < 32):
        return parts[0], parts[1], parts[2]
    else:
        return None, None, None


def _get_value(row, name):
    return row[_HEADER.index(name)] or None


def _get_id_by_value_dict(cursor, name: str):
    # noinspection SqlDialectInspection
    cursor.execute(f"select distinct \"{name}\", {name}_id from taxomap where {name}_id is not null;")
    id_by_value = {}
    for row in cursor:
        id_by_value[row[0]] = row[1]
    return id_by_value
