import {TAXONOMIC_LEVELS} from '../config';
import {Dictionaries, DictionaryEntry, Taxon, TaxonomicLevel} from '../commonTypes';

type NamedTaxon = Taxon & {
  label: string
};

const useTaxonPath = (selectedTaxon: Taxon, dictionaries: Dictionaries): Array<NamedTaxon> => {

  const levelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  const taxon = dictionaries[selectedTaxon.level].find(el => el.id === selectedTaxon.id);

  const taxoPath: Array<DictionaryEntry> = [];
  if (taxon) {
    taxoPath.push(taxon);
    for (let step = levelIndex; step > 0; step--) {
      const parentLevel = TAXONOMIC_LEVELS[step - 1] as TaxonomicLevel;
      const currentTaxonId: number | undefined = taxoPath[0][`${parentLevel}_id`];
      const parentDictionaryEntry: DictionaryEntry | undefined = dictionaries[TAXONOMIC_LEVELS[step - 1] as TaxonomicLevel].find(el => el.id === currentTaxonId);
      if (parentDictionaryEntry) {
        taxoPath.unshift(parentDictionaryEntry);
      }
    }
  }

  return taxoPath.map((el, i) => ({
    level: TAXONOMIC_LEVELS[i] as TaxonomicLevel,
    label: el.name,
    id: el.id
  }));
};

export default useTaxonPath;
