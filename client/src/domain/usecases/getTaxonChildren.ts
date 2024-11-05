import {ChildCount, Dictionaries, SubtaxonCount, Taxon} from '../../commonTypes';
import {isLeafTaxonomicLevel, nextTaxonomicLevel} from '../../taxonomicLevelUtils';

const getTaxonChildren = (
  subtaxonCount: SubtaxonCount | undefined, selectedTaxon: Taxon | undefined, dictionaries: Dictionaries
): Array<ChildCount> | undefined => {
  if (!subtaxonCount || !selectedTaxon || isLeafTaxonomicLevel(selectedTaxon.level)) {
    return [];
  }

  return dictionaries[nextTaxonomicLevel(selectedTaxon.level)]
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
    .sort((a, b) => (a.count < b.count) ? 1 : -1);
};

export default getTaxonChildren;
