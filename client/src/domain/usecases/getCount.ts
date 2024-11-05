import {BBOX, Dictionaries, Filters, GroupBy, TaxomapData, TaxonomicLevel} from '../../commonTypes';

export type Counts = Record<number, number>;

const getCount = (
  data: TaxomapData | undefined,
  dictionaries: Dictionaries,
  filters: Filters,
  groupBy: GroupBy
): Counts => {
  const isLeaf = filters.taxon.level === TaxonomicLevel.subspecies;
  if (!data || !dictionaries || isLeaf) {
    // No data available yet
    return {};
  }

  const {institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility} = filters;
  const counts: Counts = {};
  for (let i = 0; i < data.length; i++) {
    const lon = data.attributes.getPosition.value[2 * i]; // x
    const lat = data.attributes.getPosition.value[2 * i + 1]; // y
    if (
      (!institutionId || data.institutioncode[i] === filters.institutionId) &&
      (!basisOfRecordId || data.basisofrecord[i] === filters.basisOfRecordId) &&
      (!yearRange || (data.year[i] >= yearRange[0] && data.year[i] <= yearRange[1])) &&
      (data[filters.taxon.level][i] === filters.taxon.id) &&
      (!subtaxonVisibility || subtaxonVisibility.isVisible[data[subtaxonVisibility.subtaxonLevel][i]]) &&
      (!bbox || isInsideOfBBOX(bbox, lon, lat))
    ) {
      if (!counts[data[groupBy][i]]) {
        counts[data[groupBy][i]] = 0;
      }
      counts[data[groupBy][i]] += 1;
    }
  }
  return counts;
};

const isInsideOfBBOX = (BBOX: BBOX, x: number, y: number): boolean => {
  const [xMin, yMin, xMax, yMax] = BBOX;
  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

export default getCount;
