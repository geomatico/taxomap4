import {TAXONOMIC_LEVELS} from '../config';
import {useMemo} from 'react';
import {ChildCount, Dictionaries, SubtaxonCount, Taxon, TaxonomicLevel} from '../commonTypes';

const useTaxonChildren = (subtaxonCount: SubtaxonCount, selectedTaxon: Taxon, dictionaries: Dictionaries): Array<ChildCount> => {

  return useMemo(() => {
    const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
    const isLeaf = selectedTaxon.level === TaxonomicLevel.subspecies;

    const actualItem = dictionaries[selectedTaxon.level].find(item => item.id === selectedTaxon.id);

    return isLeaf ? [] :
      dictionaries[TAXONOMIC_LEVELS[actualLevelIndex + 1] as TaxonomicLevel]
        .filter(item => item[`${selectedTaxon.level}_id`] === selectedTaxon.id)
        .map(item => ({
          ...item,
          name: item.name === '' ? `${actualItem?.name} [indet]` : item.name
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
