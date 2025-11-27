import {useEffect, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {FilterBy, FilterDictionaries} from '../commonTypes';
import {getFilterDictionaries} from '../domain/usecases/getDictionaries';

// An empty array for each field
const EMPTY_DICTIONARIES: FilterDictionaries = Object.keys(FilterBy).reduce((acc, field) => ({...acc, [field]: []}), {} as FilterDictionaries);

const useFilterDictionaries = (): FilterDictionaries => {
  const [dictionaries, setDictionaries] = useState<FilterDictionaries>(EMPTY_DICTIONARIES);
  useEffect(() => {
    getFilterDictionaries().then(setDictionaries);
  }, []);
  return dictionaries;
};

export default singletonHook<FilterDictionaries>(EMPTY_DICTIONARIES, useFilterDictionaries);
