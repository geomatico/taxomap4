import {BBOX, Filters, Range, SubtaxonVisibility, TaxonomicLevel} from '../commonTypes';
import {GEOSERVER_BASE_URL} from '../config';

const FORMAT_GEOJSON = 'application/json';
export const WFS_TYPENAME = 'taxomap:taxomap';

/**
 * These depend on how the database is generated. Make sure they always match whatever is done in `91-generate-dictionaries.sql`.
 */
export enum WFS_PROPERTY {
  institutionCodeId = 'institution_id',
  basisOfRecordId = 'basis_of_record_id',
  year = 'year',
  month = 'month',
  day = 'day',
  municipality = 'municipality',
  county = 'county',
  stateProvince = 'state_province',
  geometry = 'geometry',
  scientificName = 'scientific_name'
}

export type WfsProperties = { [key in (keyof typeof WFS_PROPERTY)]?: number | string | undefined }

/**
 * Returns the property name with the ID associated to the given taxonomic level.
 *
 * To be used for WFS queries (within this class). Visible for testing.
 *
 * @param taxonomicLevel Taxonomic level
 */
// for now there's just a convention of _id suffix
export const getPropertyName = (taxonomicLevel: TaxonomicLevel): string => taxonomicLevel + '_id';

const cqlPropertyEquals = (propertyName: string | number, propertyValue: string | number | undefined) =>
  propertyValue && propertyName ? `${propertyName} = ${propertyValue}` : undefined;

const cqlTaxonIn = (subtaxonVisibility: SubtaxonVisibility | undefined) => {
  if (!subtaxonVisibility) return undefined;

  const numSubtaxa = Object.keys(subtaxonVisibility.isVisible).length;

  const propertyName = subtaxonVisibility.subtaxonLevel;
  const visibleIds = Object.entries(subtaxonVisibility.isVisible)
    .filter(([, visible]) => visible)
    .map(([id]) => id);

  if (visibleIds.length == numSubtaxa) {
    // do not filter if all are visible
    return undefined;
  } else if (visibleIds.length === 0) {
    // no subtaxa visible, return empty response
    return '1=0';
  } else {
    return `${propertyName} IN (${visibleIds.join(',')})`;
  }
};

const cqlYearBetween = (yearRange: Range | undefined) => yearRange
  ? `${WFS_PROPERTY.year} >= ${yearRange[0]} AND ${WFS_PROPERTY.year} <= ${yearRange[1]}`
  : undefined;

const cqlBbox = (bbox: BBOX | undefined) =>
  bbox ? `BBOX(${WFS_PROPERTY.geometry},${bbox.join(',')})` : undefined;

/**
 * @param format Download format; anything that WFS `outputFormat` supports.
 * @param filters Filters to apply for the download.
 * @return WFS URL that can be used directly to download features.
 */
export const getWfsDownloadUrl = (
  format: string,
  {taxon, institutionId, basisOfRecordId, subtaxonVisibility, yearRange, bbox}: Filters
): string => {
  const url = new URL(GEOSERVER_BASE_URL + '/wfs');
  url.searchParams.append('version', '1.0.0');
  url.searchParams.append('request', 'GetFeature');
  url.searchParams.append('typeName', WFS_TYPENAME);
  url.searchParams.append('outputFormat', format);
  url.searchParams.append('content-disposition', 'attachment');

  const cqlFilters = [
    cqlPropertyEquals(getPropertyName(taxon.level), taxon.id),
    cqlPropertyEquals(WFS_PROPERTY.institutionCodeId, institutionId),
    cqlPropertyEquals(WFS_PROPERTY.basisOfRecordId, basisOfRecordId),
    cqlTaxonIn(subtaxonVisibility),
    cqlYearBetween(yearRange),
    // cql_filter and BBOX query params are mutually exclusive, BBOX needs to be introduced as part of the cql_filter
    cqlBbox(bbox)
  ];
  url.searchParams.append('cql_filter', cqlFilters.filter(Boolean).join(' AND '));

  return url.toString();
};

/**
 * Returns the requested properties for the given feature. Note that the properties might still not be present in
 * the response if they are null in origin.
 *
 * @param id The ID of the feature to obtain the properties.
 * @param propertyNames The names of the properties to obtain.
 */
export const getWfsFeatureProperties = async (
  id: number | undefined,
  propertyNames: WFS_PROPERTY[]
): Promise<WfsProperties | undefined> => {
  if (id === undefined) return undefined;

  const url = new URL(GEOSERVER_BASE_URL + '/wfs');
  url.searchParams.append('service', 'wfs');
  url.searchParams.append('version', '2.0.0');
  url.searchParams.append('request', 'GetFeature');
  url.searchParams.append('typeName', WFS_TYPENAME);
  url.searchParams.append('outputFormat', FORMAT_GEOJSON);
  url.searchParams.append('featureID', `${id}`);
  url.searchParams.append('propertyName', `${propertyNames.join(',')}`);

  const response = await fetch(url);
  if (!response.ok) return undefined;

  const featureCollection = await response.json();
  if (!featureCollection.features) return undefined;

  const properties = featureCollection.features[0].properties;
  return properties && {
    year: properties[WFS_PROPERTY.year],
    month: properties[WFS_PROPERTY.month],
    day: properties[WFS_PROPERTY.day],
    stateProvince: properties[WFS_PROPERTY.stateProvince],
    municipality: properties[WFS_PROPERTY.municipality],
    county: properties[WFS_PROPERTY.county],
    scientificName: properties[WFS_PROPERTY.scientificName]
  };
};
