import {BBOX, Filters, Range, SubtaxonVisibility, TaxonomicLevel} from '../commonTypes';
import {GEOSERVER_BASE_URL} from '../config';

export const WFS_CONFIG = {
  typename: 'taxomap:taxomap',
  /**
   * These depend on how the database is generated. Make sure they always match whatever is done in `91-generate-dictionaries.sql`.
   */
  properties: {
    institutionCodeId: 'institutioncode_id',
    basisOfRecordId: 'basisofrecord_id',
    year: 'year',
    geometry: 'geom'
  }
};

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
  ? `${WFS_CONFIG.properties.year} >= ${yearRange[0]} AND ${WFS_CONFIG.properties.year} <= ${yearRange[1]}`
  : undefined;

const cqlBbox = (bbox: BBOX | undefined) =>
  bbox ? `BBOX(${WFS_CONFIG.properties.geometry},${bbox.join(',')})` : undefined;

/**
 * @param format Download format; anything that WFS `outputFormat` supports.
 * @param filters Filters to apply for the download.
 * @return WFS URL that can be used directly to download features.
 */
export const getWfsDownloadUrl = (
  format: string,
  {taxon, institutionId, basisOfRecordId, subtaxonVisibility, yearRange, bbox}: Filters
): string => {
  const url = new URL(GEOSERVER_BASE_URL + '/wfs?');
  url.searchParams.append('version', '1.0.0');
  url.searchParams.append('request', 'GetFeature');
  url.searchParams.append('typeName', WFS_CONFIG.typename);
  url.searchParams.append('outputFormat', format);
  url.searchParams.append('content-disposition', 'attachment');

  const cqlFilters = [
    cqlPropertyEquals(getPropertyName(taxon.level), taxon.id),
    cqlPropertyEquals(WFS_CONFIG.properties.institutionCodeId, institutionId),
    cqlPropertyEquals(WFS_CONFIG.properties.basisOfRecordId, basisOfRecordId),
    cqlTaxonIn(subtaxonVisibility),
    cqlYearBetween(yearRange),
    // cql_filter and BBOX query params are mutually exclusive, BBOX needs to be introduced as part of the cql_filter
    cqlBbox(bbox)
  ];
  url.searchParams.append('cql_filter', cqlFilters.filter(Boolean).join(' AND '));

  return url.toString();
};
