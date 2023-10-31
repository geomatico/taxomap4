import {BBOX, Range, SubtaxonVisibility, Taxon, TaxonomicLevel} from '../commonTypes';
import {GEOSERVER, GEOSERVER_BASE_URL} from '../config';

/**
 * Returns the property name with the ID associated to the given taxonomic level.
 *
 * To be used for WFS queries (within this class). Visible for testing.
 *
 * @param taxonomicLevel Taxonomic level
 */
export function getPropertyName(taxonomicLevel: TaxonomicLevel) {
  switch (taxonomicLevel) {
  case TaxonomicLevel.domain:
  case TaxonomicLevel.kingdom:
  case TaxonomicLevel.phylum:
  case TaxonomicLevel.class:
  case TaxonomicLevel.order:
  case TaxonomicLevel.family:
  case TaxonomicLevel.genus:
  case TaxonomicLevel.species:
  case TaxonomicLevel.subspecies:
    // for now there's just a convention of _id suffix
    return taxonomicLevel + '_id';
  }
}

function cqlAndPropertyEquals(cql: string, propertyName: string | number, propertyValue: string | number | undefined): string {
  if (!propertyValue || !propertyName) return cql;
  else return `${cql} AND ${propertyName} = ${propertyValue}`;
}

function cqlAndTaxonIn(cql: string, subtaxonVisibility: SubtaxonVisibility | undefined): string {
  if (!subtaxonVisibility) return cql;

  const propertyName = subtaxonVisibility.subtaxonLevel;
  const subtaxa = Object.entries(subtaxonVisibility.isVisible)
    .filter(([id, visible]) => visible)
    .map(([id]) => id)
    .join(',');
  if (subtaxa) return `${cql} AND ${propertyName} IN (${subtaxa})`;
  // no subtaxa visible, return empty response
  else return `${cql} AND 1=0`;
}

function cqlAndYearBetween(cql: string, yearRange: Range | undefined) {
  if (!yearRange) return cql;
  else return cql +
    ` AND ${GEOSERVER.wfs.properties.year} >= ${yearRange[0]}` +
    ` AND ${GEOSERVER.wfs.properties.year} <= ${yearRange[1]}`;
}

function cqlAndBbox(cql: string, bbox: BBOX | undefined): string {
  if (!bbox) return cql;
  return `${cql} AND BBOX(${GEOSERVER.wfs.properties.geometry},${bbox.join(',')})`;
}

/**
 * @param format Download format; anything that WFS `outputFormat` supports.
 * @param yearRange Range filter for the year; undefined means no filter (the only way to access features with null year).
 * @param institutionId Filter for institution ID. See `static/dictionaries/institutioncode.json`.
 * @param basisOfRecordId Filter for basis of record ID.  See `static/dictionaries/basisofrecord.json`.
 * @param taxon Taxon filter.
 * @param subtaxonVisibility Subtaxon visibility. Only visible subtaxa will be taken into account.
 * @param bbox Bounding box filter for downloading.
 */
export const getWfsDownloadUrl = (
  format: string,
  yearRange: Range | undefined,
  institutionId: number | undefined,
  basisOfRecordId: number | undefined,
  taxon: Taxon,
  subtaxonVisibility: SubtaxonVisibility | undefined,
  bbox: BBOX | undefined
): string => {
  const url = new URL(GEOSERVER_BASE_URL + '/wfs?');
  url.searchParams.append('version', '1.0.0');
  url.searchParams.append('request', 'GetFeature');
  url.searchParams.append('typeName', GEOSERVER.wfs.typename);
  url.searchParams.append('outputFormat', format);

  let cqlFilter = `${getPropertyName(taxon.level)} = ${taxon.id}`;
  cqlFilter = cqlAndPropertyEquals(cqlFilter, GEOSERVER.wfs.properties.institutionCodeId, institutionId);
  cqlFilter = cqlAndPropertyEquals(cqlFilter, GEOSERVER.wfs.properties.basisOfRecordId, basisOfRecordId);
  cqlFilter = cqlAndTaxonIn(cqlFilter, subtaxonVisibility);
  cqlFilter = cqlAndYearBetween(cqlFilter, yearRange);
  // cql_filter and BBOX query params are mutually exclusive, BBOX needs to be introduced as part of the cql_filter
  cqlFilter = cqlAndBbox(cqlFilter, bbox);

  if (cqlFilter) url.searchParams.append('cql_filter', cqlFilter);
  return url.toString();
};

export default {
  getWfsDownloadUrl,
  getPropertyName
};