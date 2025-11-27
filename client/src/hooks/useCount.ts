import {Filters, GroupBy, TaxomapData} from '../commonTypes';
import {useMemo} from 'react';
import getCount, {Counts} from '../domain/usecases/getCount';

type UseCountParams = {
  data: TaxomapData | undefined,
  filters: Filters,
  groupBy: GroupBy
};

const useCount = ({data, filters, groupBy}: UseCountParams): Counts => {
  return useMemo(
    () => getCount(data, filters, groupBy),
    [data, filters, groupBy]);
};

export default useCount;
