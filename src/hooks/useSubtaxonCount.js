import useArrowData from './useArrowData';
import useDictionaries from './useDictionaries';
import {TAXONOMIC_LEVELS} from '../config';

const useSubtaxonCount = ({institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon, BBOX}) => {
  const data = useArrowData();
  const dictionaries = useDictionaries();
  if (!data || !dictionaries) return {}; // No data available yet

  const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  if (actualLevelIndex === TAXONOMIC_LEVELS.length - 1) return {}; // Last level, no children
  const nextLevel = TAXONOMIC_LEVELS[actualLevelIndex + 1];
  const isInsideOfBBOX = (x, y) => {
    const [xMin, yMin, xMax, yMax] = BBOX;
    return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
  };

  let count = {};
  for (let i = 0; i < data.length; i++) {
    const lat = data.attributes.getPosition.value[2 * i + 1]; //Y
    const lon = data.attributes.getPosition.value[2 * i]; //x
    if (
      (!institutionFilter || data.institutioncode[i] === institutionFilter) &&
      (!basisOfRecordFilter || data.basisofrecord[i] === basisOfRecordFilter) &&
      (!yearFilter || (data.year[i] >= yearFilter[0] && data.year[i] <= yearFilter[1])) &&
      (data[selectedTaxon.level][i] === selectedTaxon.id) &&
      (!BBOX || isInsideOfBBOX(lon, lat))
    ) {
      const childId = data[nextLevel][i];
      count[childId] = (count[childId] || 0) + 1;
    }
  }
  return count;
};

export default useSubtaxonCount;
