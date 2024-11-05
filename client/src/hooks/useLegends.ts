import {useMemo} from 'react';
import getLegends, {Legends} from '../domain/usecases/getLegends';
import useDictionaries from './useDictionaries';

const useLegends = (): Legends => {
  const dictionaries = useDictionaries();
  return useMemo(() => getLegends(dictionaries), [dictionaries]);
};

export default useLegends;
