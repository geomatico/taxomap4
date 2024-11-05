import {tableFromIPC} from 'apache-arrow';
import {Dictionaries, Dictionary, TaxomapData} from '../commonTypes';
import {FIELDS} from '../domain/usecases/getDictionaries';
import {toTaxomapData} from '../domain/usecases/getTaxomapData';

export const readTestTaxomapData = async (): Promise<TaxomapData> => {
  const arrowTable = await tableFromIPC(fetch('/base/test/resources/taxomap.arrow'));
  return toTaxomapData(arrowTable);
};

export const fetchTestDictionary = (name: string) => fetch(`/base/test/resources/dictionaries/${name}.json`);

export const readTestDictionaries = async (): Promise<Dictionaries> => {
  const fetchField = async (field: string): Promise<Dictionary> => {
    const response = await fetchTestDictionary(field);
    return response.json();
  };

  const dictionaries: Array<Dictionary> = await Promise.all(FIELDS.map(fetchField));
  return dictionaries.reduce((acc, dictionary, i) => {
    const dictKey = FIELDS[i] as keyof Dictionaries;
    acc[dictKey] = dictionary;
    return acc;
  }, {} as Dictionaries);
};
