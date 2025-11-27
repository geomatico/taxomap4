import {tableFromIPC} from 'apache-arrow';
import {
  FilterBy,
  FilterDictionaries,
  TaxomapData,
  TaxonDictionaries, TaxonomicLevel
} from '../commonTypes';
import {toTaxomapData} from '../domain/usecases/getTaxomapData';

export const readTestTaxomapData = async (): Promise<TaxomapData> => {
  const arrowTable = await tableFromIPC(fetch('/base/test/resources/taxomap.arrow'));
  return toTaxomapData(arrowTable);
};

const TAXONOMIC_LEVELS = Object.keys(TaxonomicLevel);
const FILTER_TYPES = [FilterBy.basisofrecord, FilterBy.institutioncode];

export const readTestTaxonDictionaries = async (): Promise<TaxonDictionaries> => {
  const dictionaries = await Promise.all(TAXONOMIC_LEVELS.map(fetchJSON));
  return dictionaries.reduce((acc, dictionary, i) => {
    acc[TAXONOMIC_LEVELS[i]] = dictionary;
    return acc;
  }, {});
};

export const readTestFilterDictionaries = async (): Promise<FilterDictionaries> => {
  const dictionaries = await Promise.all(FILTER_TYPES.map(fetchJSON));
  return dictionaries.reduce((acc, dictionary, i) => {
    acc[FILTER_TYPES[i]] = dictionary;
    return acc;
  }, {});
};

const fetchJSON = async (name: string) => {
  const response = await fetch(`/base/test/resources/dictionaries/${name}.json`);
  return response.json();
};
