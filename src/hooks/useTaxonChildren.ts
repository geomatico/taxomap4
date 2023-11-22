import {useMemo} from 'react';
import {ChildCount, Dictionaries, SubtaxonCount, Taxon} from '../commonTypes';
import {isLeafTaxonomicLevel, nextTaxonomicLevel} from '../taxonomicLevelUtils';

const useTaxonChildren = (subtaxonCount: SubtaxonCount, selectedTaxon: Taxon, dictionaries: Dictionaries): Array<ChildCount> =>
  useMemo(() => isLeafTaxonomicLevel(selectedTaxon.level) ? [] :
    dictionaries[nextTaxonomicLevel(selectedTaxon.level)]
      .filter(item => item[`${selectedTaxon.level}_id`] === selectedTaxon.id)
      .map(item => ({
        ...item,
        name: item.name
      }))
      .map(item => ({
        ...item,
        count: subtaxonCount[item.id] || 0
      }))
      .filter(item => item.count !== 0)
      .sort((a, b) => (a.count < b.count) ? 1 : -1)
  , [subtaxonCount, selectedTaxon, dictionaries]);

export default useTaxonChildren;
