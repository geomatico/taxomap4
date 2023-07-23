import useArrowData from './useArrowData';
import useDictionaries from './useDictionaries';
import {TAXONOMIC_LEVELS} from '../config';

const useCount = ({institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon, entity}) => {
  const data = useArrowData();
  const dictionaries = useDictionaries();

  if (!data || !dictionaries) return {}; // No data available yet

  const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  if (actualLevelIndex === TAXONOMIC_LEVELS.length - 1) return {}; // Last level, no children

  let counts = {};
  for (let i=0; i<data.length; i++) {
    if (
      (!institutionFilter || data.institutioncode[i] === institutionFilter) &&
      (!basisOfRecordFilter || data.basisofrecord[i] === basisOfRecordFilter) &&
      (!yearFilter || (data.year[i] >= yearFilter[0] && data.year[i] <= yearFilter[1])) &&
      (data[selectedTaxon.level][i] === selectedTaxon.id)
    ) {
      if(!counts[data[entity][i]]) counts[data[entity][i]] = 0;
      counts[data[entity][i]] += 1;
    }
  }

  return counts;
};

export default useCount;
