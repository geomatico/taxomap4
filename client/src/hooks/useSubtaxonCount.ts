import useArrowData from './useArrowData';
import useTaxonDictionaries from './useTaxonDictionaries';
import {Filters, TaxomapData} from '../commonTypes';
import {useMemo} from 'react';
import getSubtaxonCount from '../domain/usecases/getSubtaxonCount';

const useSubtaxonCount = (
  {taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility}: Partial<Filters>
) => {
  const data: TaxomapData | undefined = useArrowData();
  const taxonDictionaries = useTaxonDictionaries();
  return useMemo(
    () => getSubtaxonCount(data, taxonDictionaries,
      {taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility}),
    [data, taxonDictionaries, taxon, institutionId, basisOfRecordId, yearRange, bbox, subtaxonVisibility]);
};

export default useSubtaxonCount;
