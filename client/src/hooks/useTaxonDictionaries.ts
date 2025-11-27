import {useEffect, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {TaxonDictionaries, TaxonomicLevel} from '../commonTypes';
import {getTaxonDictionaries} from '../domain/usecases/getDictionaries';

// An empty array for each field
const EMPTY_DICTIONARIES: TaxonDictionaries = Object.keys(TaxonomicLevel).reduce((acc, field) => ({...acc, [field]: []}), {} as TaxonDictionaries);

const useTaxonDictionaries = (): TaxonDictionaries => {
  const [dictionaries, setDictionaries] = useState<TaxonDictionaries>(EMPTY_DICTIONARIES);
  useEffect(() => {
    getTaxonDictionaries().then(setDictionaries);
  }, []);
  return dictionaries;
};

export default singletonHook<TaxonDictionaries>(EMPTY_DICTIONARIES, useTaxonDictionaries);
