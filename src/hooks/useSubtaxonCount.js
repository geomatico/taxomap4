import useArrowData from './useArrowData';
import useDictionaries from './useDictionaries';
import {TAXONOMIC_LEVELS} from '../config';

const useSubtaxonCount = ({institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon}) => {
  const data = useArrowData();
  const dictionaries = useDictionaries();
  if (!data || !dictionaries) return {}; // No data available yet

  const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  if (actualLevelIndex === TAXONOMIC_LEVELS.length - 1) return {}; // Last level, no children
  const nextLevel = TAXONOMIC_LEVELS[actualLevelIndex + 1];

  let count = {};
  for (let i=0; i<data.length; i++) {
    if (
      (!institutionFilter || data.institutioncode[i] === institutionFilter) &&
      (!basisOfRecordFilter || data.basisofrecord[i] === basisOfRecordFilter) &&
      (!yearFilter || (data.year[i] >= yearFilter[0] && data.year[i] <= yearFilter[1])) &&
      (data[selectedTaxon.level][i] === selectedTaxon.id)
    ) {
      const childId = data[nextLevel][i];
      count[childId] = (count[childId] || 0) + 1;
    }
  }
  return count;
};

export default useSubtaxonCount;
