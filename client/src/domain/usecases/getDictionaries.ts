import {Dictionaries, Dictionary, FilterBy, TaxonomicLevel} from '../../commonTypes';
import {STATIC_RESOURCES_HOST} from '../../config';


export const PATH = `${STATIC_RESOURCES_HOST}/static/dictionaries`;
export const FIELDS = [
  ...Object.keys(TaxonomicLevel),
  ...Object.keys(FilterBy)
].filter(k => k !== 'year'); // "year" is an exception, no dictionary available for it

const getDictionaries = async (): Promise<Dictionaries> => {
  const dictionaries: Array<Dictionary> = await Promise.all(FIELDS.map(fetchField));
  return dictionaries.reduce((acc, dictionary, i) => {
    const dictKey = FIELDS[i] as keyof Dictionaries;
    acc[dictKey] = dictionary;
    return acc;
  }, {} as Dictionaries);
};

const fetchField = async (field: string): Promise<Dictionary> => {
  const response = await fetch(`${PATH}/${field}.json`);
  return response.json();
};

export const getIdByName = (dictionary: Dictionary, name: string) =>
  dictionary.find(entry => entry.name === name)?.id ?? 0;

export default getDictionaries;