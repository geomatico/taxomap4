import {Dictionaries, Filters, GroupBy, TaxomapData} from '../commonTypes';
import {useMemo} from 'react';
import getCount, {Counts} from '../domain/usecases/getCount';

type UseCountParams = {
  data: TaxomapData | undefined,
  dictionaries: Dictionaries,
  filters: Filters,
  groupBy: GroupBy
};

const useCount = ({data, dictionaries, filters, groupBy}: UseCountParams): Counts => {
  return useMemo(
    () => getCount(data, dictionaries, filters, groupBy),
    [data, dictionaries, filters, groupBy]);
};

export default useCount;
