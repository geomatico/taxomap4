import {useEffect, useState} from 'react';
import {DATA_PROPS} from '../config';
import {singletonHook} from 'react-singleton-hook';

// eslint-disable-next-line no-unused-vars
const fields = Object.keys(DATA_PROPS).filter(item => item !== 'year'); // "year" is an exception, no dictionary available for it

const emptyDictionaries = fields.reduce((acc, field) => ({...acc, [field]: []}), {}); // An empty array for each field

const useDictionaries = () => {
  const [dictionaries, setDictionaries] = useState(emptyDictionaries);

  useEffect(() => {
    const promises = fields.map(field => fetch(`data/dictionaries/${field}.json`).then(response => response.json()));
    Promise.all(promises).then(responses => {
      const fullDictionaries = responses.reduce((acc, response, i) => {
        acc[fields[i]] = response;
        return acc;
      }, {});
      setDictionaries(fullDictionaries);
    });
  }, []);

  return dictionaries;
};

export default singletonHook(emptyDictionaries, useDictionaries);
