import {useMemo} from 'react';
import getLegends, {Legends} from '../domain/usecases/getLegends';
import useFilterDictionaries from './useFilterDictionaries';
import {Lang} from '../commonTypes';
import useTaxonDictionaries from './useTaxonDictionaries';

const useLegends = (lang: Lang): Legends => {
  const filterDictionaries = useFilterDictionaries();
  const taxonDictionaries = useTaxonDictionaries();
  return useMemo(() => getLegends(filterDictionaries, taxonDictionaries, lang), [filterDictionaries, lang]);
};

export default useLegends;
