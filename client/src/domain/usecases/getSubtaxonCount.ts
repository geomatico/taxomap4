import {BBOX, TaxonDictionaries, Filters, SubtaxonCount, TaxomapData, TaxonomicLevel} from '../../commonTypes';
import {nextTaxonomicLevel} from '../../taxonomicLevelUtils';

const getSubtaxonCount = (
  data: TaxomapData | undefined,
  taxonDictionaries: TaxonDictionaries,
  {taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility}: Partial<Filters>
): SubtaxonCount | undefined => {
  if (taxon === undefined) {
    return undefined;
  }

  const isLeaf = taxon.level === TaxonomicLevel.subspecies;

  if (!data || !taxonDictionaries || isLeaf) {
    // No data available yet, or is last level and has no children
    return {};
  }

  const nextLevel = nextTaxonomicLevel(taxon.level);

  const count: SubtaxonCount = {};
  for (let i = 0; i < data.length; i++) {
    const lon = data.attributes.getPosition.value[2 * i]; // x
    const lat = data.attributes.getPosition.value[2 * i + 1]; // y
    if (
      (!institutionId || data.institutioncode[i] === institutionId) &&
      (!basisOfRecordId || data.basisofrecord[i] === basisOfRecordId) &&
      (!yearRange || (data.year[i] >= yearRange[0] && data.year[i] <= yearRange[1])) &&
      (data[taxon.level][i] === taxon.id) &&
      (!subtaxonVisibility || subtaxonVisibility.isVisible[data[subtaxonVisibility.subtaxonLevel][i]]) &&
      (!bbox || isInsideOfBBOX(bbox, lon, lat))
    ) {
      const childId = data[nextLevel][i];
      count[childId] = (count[childId] || 0) + 1;
    }
  }
  return count;
};

const isInsideOfBBOX = (BBOX: BBOX, x: number, y: number): boolean => {
  const [xMin, yMin, xMax, yMax] = BBOX;
  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

export default getSubtaxonCount;