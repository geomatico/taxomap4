import useArrowData from './useArrowData';
import useDictionaries from './useDictionaries';
import {BBOX, Dictionaries, Filters, SubtaxonCount, TaxomapData, TaxonomicLevel} from '../commonTypes';
import {useMemo} from 'react';
import {TAXONOMIC_LEVELS} from '../config';

const isInsideOfBBOX = (BBOX: BBOX, x: number, y: number): boolean => {
  const [xMin, yMin, xMax, yMax] = BBOX;
  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

const useSubtaxonCount = ({taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility}: Filters) => {
  const data: TaxomapData | undefined = useArrowData();
  const dictionaries: Dictionaries = useDictionaries();

  return useMemo(() => {
    const isLeaf = taxon.level === TaxonomicLevel.subspecies;

    if (!data || !dictionaries || isLeaf) return {}; // No data available yet, or is last level and has no children

    const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(taxon.level);
    const nextLevel: TaxonomicLevel = TAXONOMIC_LEVELS[actualLevelIndex + 1] as TaxonomicLevel;

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
  }, [taxon, institutionId, basisOfRecordId, yearRange, bbox, data, dictionaries, subtaxonVisibility]);
};

export default useSubtaxonCount;
