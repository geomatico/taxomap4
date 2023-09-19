import useArrowData from './useArrowData';
import useDictionaries from './useDictionaries';
import {
  BBOX,
  Dictionaries,
  SubtaxonCount, SubtaxonVisibility,
  TaxomapData,
  Taxon,
  TaxonomicLevel,
  Range
} from '../commonTypes';
import {useMemo} from 'react';
import {TAXONOMIC_LEVELS} from '../config';

const isInsideOfBBOX = (BBOX: BBOX, x: number, y: number): boolean => {
  const [xMin, yMin, xMax, yMax] = BBOX;
  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

type UseSubtaxonCountParam = {
  selectedTaxon: Taxon,
  institutionFilter?: number,
  basisOfRecordFilter?: number,
  yearFilter?: Range,
  BBOX?: BBOX,
  subtaxonVisibility?: SubtaxonVisibility,
};

const useSubtaxonCount = ({selectedTaxon, institutionFilter, basisOfRecordFilter, yearFilter, BBOX, subtaxonVisibility}: UseSubtaxonCountParam) => {
  const data: TaxomapData | undefined = useArrowData();
  const dictionaries: Dictionaries = useDictionaries();

  return useMemo(() => {
    const isLeaf = selectedTaxon.level === TaxonomicLevel.subspecies;

    if (!data || !dictionaries || isLeaf) return {}; // No data available yet, or is last level and has no children

    const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
    const nextLevel: TaxonomicLevel = TAXONOMIC_LEVELS[actualLevelIndex + 1] as TaxonomicLevel;

    const count: SubtaxonCount = {};
    for (let i = 0; i < data.length; i++) {
      const lon = data.attributes.getPosition.value[2 * i]; // x
      const lat = data.attributes.getPosition.value[2 * i + 1]; // y
      if (
        (!institutionFilter || data.institutioncode[i] === institutionFilter) &&
        (!basisOfRecordFilter || data.basisofrecord[i] === basisOfRecordFilter) &&
        (!yearFilter || (data.year[i] >= yearFilter[0] && data.year[i] <= yearFilter[1])) &&
        (data[selectedTaxon.level][i] === selectedTaxon.id) &&
        (!subtaxonVisibility || subtaxonVisibility.isVisible[data[subtaxonVisibility.subtaxonLevel][i]]) &&
        (!BBOX || isInsideOfBBOX(BBOX, lon, lat))
      ) {
        const childId = data[nextLevel][i];
        count[childId] = (count[childId] || 0) + 1;
      }
    }
    return count;
  }, [selectedTaxon, institutionFilter, basisOfRecordFilter, yearFilter, BBOX, data, dictionaries, subtaxonVisibility]);
};

export default useSubtaxonCount;
