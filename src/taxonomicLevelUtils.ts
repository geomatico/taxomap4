import {Dictionaries, DictionaryEntry, TaxonomicLevel} from './commonTypes';

const TAXONOMIC_LEVELS : TaxonomicLevel[] = Object.values(TaxonomicLevel);

export const nextTaxonomicLevel = (level: TaxonomicLevel): TaxonomicLevel => {
  const index = TAXONOMIC_LEVELS.indexOf(level);
  return TAXONOMIC_LEVELS[index + 1];
};

export const previousTaxonomicLevel = (level: TaxonomicLevel): TaxonomicLevel => {
  const index = TAXONOMIC_LEVELS.indexOf(level);
  return TAXONOMIC_LEVELS[index - 1];
};

export const isRootTaxonomicLevel = (level: TaxonomicLevel): boolean => {
  const index = TAXONOMIC_LEVELS.indexOf(level);
  return index === 0;
};
export const isLeafTaxonomicLevel = (level: TaxonomicLevel): boolean => level === TaxonomicLevel.subspecies;

export const findDictionaryEntry = (level: TaxonomicLevel, id: number | undefined, dictionaries: Dictionaries): DictionaryEntry | undefined =>
  level && dictionaries[level].find(el => el.id === id);
