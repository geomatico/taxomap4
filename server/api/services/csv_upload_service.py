from datetime import datetime

from django.contrib.gis import geos
from rest_framework.exceptions import ParseError

from api.repositories.basis_of_record import BasisOfRecordRepository
from api.repositories.country import CountryRepository
from api.repositories.institution import InstitutionRepository
from api.repositories.occurrence import Occurrence, OccurrenceRepository, VerificationStatus
from api.repositories.taxonomy import TaxonomyRepository

EXPECTED_COLUMNS = (
    'collectionCode', 'catalogNumber', 'taxonID', 'decimalLatitude', 'decimalLongitude', 'eventDate',
    'institutionCode', 'basisOfRecord', 'countryCode', 'municipality', 'county', 'stateProvince',
)
NOT_NULL_COLUMNS = (
    'collectionCode', 'catalogNumber', 'taxonID', 'decimalLatitude', 'decimalLongitude',
    'institutionCode', 'basisOfRecord',
)

INSTITUTION_NAME_BY_ENUM_TEXT = {
    'IMEDEA': 'Institut Mediterrani d\'Estudis Avançats',
    'MCNB': 'Museu Ciències Naturals Barcelona',
    'MVHN': 'Museu Valencià d\'Història Natural',
    'UB': 'Universitat de Barcelona',
    'IBB': 'Institut Botànic de Barcelona',
}

BASIS_OF_RECORD_NAME_BY_ENUM_TEXT = {
    'FOSSIL': 'Fossil',
    'NON_FOSSIL': 'Non-fossil',
}


def persist_csv(csv_reader):
    repository = OccurrenceRepository()
    header = next(csv_reader)
    _validate_header(header)

    errors = []
    for row in csv_reader:
        if not row:
            # ignore last line if empty
            continue

        try:
            occurrence = _row_to_occurrence(header, row)
            repository.save_or_replace(occurrence)
        except CsvValueError as exception:
            errors.append(row + [exception.error])

    return [header] + errors if errors else None


def _validate_header(header: list[str]) -> None:
    missing_columns = [column for column in EXPECTED_COLUMNS if column not in header]
    if missing_columns:
        raise ParseError(f'Invalid CSV. Missing columns: {missing_columns}')


def _row_to_occurrence(header, row) -> Occurrence:
    def get_value(name):
        try:
            return str(row[header.index(name)]).strip() or None
        except IndexError:
            return None

    columns_with_invalid_nulls = [column for column in NOT_NULL_COLUMNS if not get_value(column)]
    if columns_with_invalid_nulls:
        raise CsvValueError(f'Nulos para las columnas: {columns_with_invalid_nulls}')

    collection_code = get_value('collectionCode')
    catalog_number = get_value('catalogNumber')
    date = _get_date(get_value)
    longitude, latitude = _get_coordinate(get_value)
    gbif_id = _get_gbif_id(get_value)
    institution = _get_institution(get_value)
    basis_of_record = _get_basis_of_record(get_value)
    country_code = _get_country_code(get_value)
    municipality = get_value('municipality')
    county = get_value('county')
    state_province = get_value('stateProvince')

    return Occurrence(
        geometry=geos.Point(longitude, latitude),
        occurrence_id=f'{institution.name}:{collection_code}:{catalog_number}',
        collection_code=collection_code,
        catalog_number=catalog_number,
        institution_id=institution.id,
        basis_of_record_id=basis_of_record.id,
        taxon_id=gbif_id,
        event_date=date,
        country_code=country_code,
        municipality=municipality,
        county=county,
        state_province=state_province,
        georeference_verification_status=VerificationStatus.VERIFIED,
        identification_verification_status=VerificationStatus.VERIFIED,
    )


def _get_date(get_value):
    date_str = get_value('eventDate')
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str)
    except BaseException:
        raise CsvValueError(f'Fecha no válida (ISO8601 YYYY-MM-DD): {date_str}')


def _get_coordinate(get_value):
    longitude_str = get_value('decimalLongitude')
    latitude_str = get_value('decimalLatitude')
    try:
        longitude = float(longitude_str)
        latitude = float(latitude_str)
        if not (-180 <= longitude <= 180) or not (-90 <= latitude <= 90):
            raise CsvValueError(f'Coordenadas no válidas: ({longitude_str},{latitude_str})')
        return longitude, latitude
    except BaseException:
        raise CsvValueError(f'Coordenadas no válidas: ({longitude_str},{latitude_str})')


def _get_gbif_id(get_value):
    gbif_id_str = get_value('taxonID')
    try:
        gbif_id = int(gbif_id_str)
        if not TaxonomyRepository().exists_by_id(gbif_id):
            raise CsvValueError(f'Invalid GBIF id: {gbif_id}')
        return gbif_id
    except BaseException:
        raise CsvValueError(f'Invalid GBIF id: {gbif_id_str}')


def _get_institution(get_value):
    institution_enum = get_value('institutionCode')
    try:
        institution = InstitutionRepository().get_by_name(INSTITUTION_NAME_BY_ENUM_TEXT[institution_enum])
        if not institution:
            raise CsvValueError(f'Invalid institution: {institution_enum}')
        return institution
    except BaseException:
        raise CsvValueError(f'Invalid institution: {institution_enum}')


def _get_basis_of_record(get_value):
    basis_of_record_enum = get_value('basisOfRecord')
    try:
        basis_of_record = BasisOfRecordRepository().get_by_name_en(
            BASIS_OF_RECORD_NAME_BY_ENUM_TEXT[basis_of_record_enum]
        )
        if not basis_of_record:
            raise CsvValueError(f'Invalid basis of record: {basis_of_record_enum}')
        return basis_of_record
    except BaseException:
        raise CsvValueError(f'Invalid basis of record: {basis_of_record_enum}')


def _get_country_code(get_value):
    country_code = get_value('countryCode')
    if not country_code:
        return None
    try:
        if not CountryRepository().exists_by_code(country_code):
            raise CsvValueError(f'Invalid country code: {country_code}')
        return country_code
    except BaseException:
        raise CsvValueError(f'Invalid country code: {country_code}')


class CsvValueError(Exception):
    def __init__(self, error: str):
        self.error = error
