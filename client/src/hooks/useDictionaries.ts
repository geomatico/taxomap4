import {useEffect, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {Dictionaries} from '../commonTypes';
import getDictionaries, {FIELDS} from '../domain/usecases/getDictionaries';

// An empty array for each field
const EMPTY_DICTIONARIES: Dictionaries = FIELDS.reduce((acc, field) => ({...acc, [field]: []}), {} as Dictionaries);

const useDictionaries = (): Dictionaries => {
  const [dictionaries, setDictionaries] = useState<Dictionaries>(EMPTY_DICTIONARIES);
  useEffect(() => {
    getDictionaries().then(setDictionaries);
  }, []);
  return dictionaries;
};

export default singletonHook<Dictionaries>(EMPTY_DICTIONARIES, useDictionaries);
