import useArrowData from './useArrowData';
import useDictionaries from './useDictionaries';
import {Dictionaries, Filters, TaxomapData} from '../commonTypes';
import {useMemo} from 'react';
import getSubtaxonCount from '../domain/usecases/getSubtaxonCount';

const useSubtaxonCount = (
  {taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility}: Partial<Filters>
) => {
  const data: TaxomapData | undefined = useArrowData();
  const dictionaries: Dictionaries = useDictionaries();
  return useMemo(
    () => getSubtaxonCount(data, dictionaries,
      {taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility}),
    [data, dictionaries, taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility]);
};

export default useSubtaxonCount;
