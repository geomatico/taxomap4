import {
  FilterBy,
  FilterDictionaries,
  TaxonDictionaries,
  TaxonomicLevel
} from '../../commonTypes';
import {STATIC_RESOURCES_HOST} from '../../config';


export const PATH = `${STATIC_RESOURCES_HOST}/static/dictionaries`;
const TAXONOMIC_LEVELS = Object.keys(TaxonomicLevel);
const FILTER_TYPES = [FilterBy.basisofrecord, FilterBy.institutioncode];

const getTaxonDictionaries = async (): Promise<TaxonDictionaries> => {
  const dictionaries = await Promise.all(TAXONOMIC_LEVELS.map(fetchJson));
  return dictionaries.reduce((acc, dictionary, i) => {
    acc[TAXONOMIC_LEVELS[i]] = dictionary;
    return acc;
  }, {});
};

const getFilterDictionaries = async (): Promise<FilterDictionaries> => {
  const dictionaries = await Promise.all(FILTER_TYPES.map(fetchJson));
  return dictionaries.reduce((acc, dictionary, i) => {
    acc[FILTER_TYPES[i]] = dictionary;
    return acc;
  }, {});
};

const fetchJson = async (name: string) => {
  const response = await fetch(`${PATH}/${name}.json`);
  return response.json();
};

export {getTaxonDictionaries, getFilterDictionaries};