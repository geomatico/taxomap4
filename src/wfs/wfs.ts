import {BBOX, Range, SubtaxonVisibility, Taxon} from '../commonTypes';
import {GEOSERVER_BASE_URL} from '../config';

/**
 * @param format Download format; anything that WFS `outputFormat` supports.
 * @param yearFilter Range filter for the year; undefined means no filter (the only way to access features with null year).
 * @param institutionFilter Filter for institution ID. See `static/dictionaries/institutioncode.json`.
 * @param basisOfRecordFilter Filter for basis of record ID.  See `static/dictionaries/basisofrecord.json`.
 * @param selectedTaxon Selected taxon.
 * @param subtaxonVisibility Subtaxon visibility. Only visible subtaxa will be taken into account.
 * @param bbox Bounding box filter for downloading // TODO CRS?
 */
export const getWfsDownloadUrl = (
  format: string,
  yearFilter: Range | undefined,
  institutionFilter: number | undefined,
  basisOfRecordFilter: number | undefined,
  selectedTaxon: Taxon,
  subtaxonVisibility: SubtaxonVisibility | undefined,
  bbox: BBOX | undefined
): string => {
  return `${GEOSERVER_BASE_URL}/wfs?version=1.0.0&request=GetFeature&typeName=taxomap:taxomap&outputFormat=${format}&maxFeatures=1`;
};
