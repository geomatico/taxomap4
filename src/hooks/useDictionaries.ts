import {useEffect, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {Dictionaries, Dictionary, FilterBy, TaxonomicLevel} from '../commonTypes';

const fields = [...Object.keys(TaxonomicLevel), ...Object.keys(FilterBy)].filter(k => k !== 'year'); // "year" is an exception, no dictionary available for it
const emptyDictionaries: Dictionaries = fields.reduce((acc, field) => ({...acc, [field]: []}), {} as Dictionaries); // An empty array for each field

const useDictionaries = (): Dictionaries => {
  const [dictionaries, setDictionaries] = useState<Dictionaries>(emptyDictionaries);

  useEffect(() => {
    const promises = fields.map(field => fetch(`data/dictionaries/${field}.json`).then(response => response.json()));
    Promise.all(promises).then((responses: Array<Dictionary>) => {
      const fullDictionaries: Dictionaries = responses.reduce((acc, response, i) => {
        const dictKey = fields[i] as keyof Dictionaries;
        acc[dictKey] = response;
        return acc;
      }, {} as Dictionaries);
      setDictionaries(fullDictionaries);
    });
  }, []);

  return dictionaries;
};

export default singletonHook<Dictionaries>(emptyDictionaries, useDictionaries);
