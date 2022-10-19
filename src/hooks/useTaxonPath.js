import {TAXONOMIC_LEVELS} from '../config';
import useDictionaries from './useDictionaries';

const useTaxonPath = (selectedTaxon) => {
  const dictionaries = useDictionaries();
  const index = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  const taxon = dictionaries[selectedTaxon.level].find(el => el.id === selectedTaxon.id);

  const taxoPath = [];
  if (taxon) {
    taxoPath.push(taxon);
    for (let step = index; step > 0; step--) {
      const actualTaxon = taxoPath[0][TAXONOMIC_LEVELS[step - 1] + '_id'];
      const previousTaxon = dictionaries[TAXONOMIC_LEVELS[step - 1]].find(el => el.id === actualTaxon);
      taxoPath.unshift(previousTaxon);
    }
  }

  return taxoPath.map((el, i) => ({
    level: TAXONOMIC_LEVELS[i],
    label: el.name === '' ? taxoPath[i -1].name + '[indet]': el.name,
    id: el.id
  }));
};

export default useTaxonPath;
