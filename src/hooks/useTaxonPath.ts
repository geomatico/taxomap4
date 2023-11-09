import {Dictionaries, Taxon} from '../commonTypes';
import {findDictionaryEntry, previousTaxonomicLevel} from '../taxonomicLevelUtils';

type NamedTaxon = Taxon & {
  label: string
};

const useTaxonPath = (selectedTaxon: Taxon, dictionaries: Dictionaries): Array<NamedTaxon> => {
  const taxoPath: Array<NamedTaxon> = [];
  let level = selectedTaxon.level;
  let id: number | undefined = selectedTaxon.id;
  while (level && id) {
    const taxonEntry = findDictionaryEntry(level, id, dictionaries);
    if (!taxonEntry) break;

    taxoPath.unshift({
      level: level,
      label: taxonEntry.name,
      id: taxonEntry.id
    });
    level = previousTaxonomicLevel(level);
    id = taxonEntry[`${level}_id`];
  }

  return taxoPath || undefined;
};

export default useTaxonPath;
