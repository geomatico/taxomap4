import {TAXONOMIC_LEVELS} from '../config';
import {useMemo} from 'react';

const useTaxonChildren = (subtaxonCount, selectedTaxon, dictionaries) => {

  return useMemo(() => {
    const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
    const isLeafLevel = actualLevelIndex === TAXONOMIC_LEVELS.length - 1;
    const actualItem = dictionaries[selectedTaxon.level].find(item => item.id === selectedTaxon.id);

    return isLeafLevel ? [] :
      dictionaries[TAXONOMIC_LEVELS[actualLevelIndex + 1]]
        .filter(item => item[`${selectedTaxon.level}_id`] === selectedTaxon.id)
        .map(item => ({
          ...item,
          name: item.name === '' ? `${actualItem.name} [indet]` : item.name
        }))
        .map(item => ({
          ...item,
          count: subtaxonCount[item.id] || 0
        }))
        .filter(item => item.count !== 0)
        .sort((a, b) => (a.count < b.count) ? 1 : -1);
  }, [subtaxonCount, selectedTaxon, dictionaries]);
};

export default useTaxonChildren;
