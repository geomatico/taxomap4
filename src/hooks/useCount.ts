import {Dictionaries, SymbolizeBy, TaxomapData, Taxon, TaxonomicLevel, YearRange} from '../commonTypes';
import {useMemo} from 'react';

type UseCountParam = {
  data: TaxomapData,
  dictionaries: Dictionaries,
  institutionFilter?: number,
  basisOfRecordFilter?: number,
  yearFilter?: YearRange,
  selectedTaxon: Taxon,
  symbolizeBy: SymbolizeBy
};

type Counts = Record<number, number>;

const useCount = ({
  data,
  dictionaries,
  institutionFilter,
  basisOfRecordFilter,
  yearFilter,
  selectedTaxon,
  symbolizeBy
}: UseCountParam): Counts => {
  return useMemo(() => {
    const isLeaf = selectedTaxon.level === TaxonomicLevel.subspecies;
    if (!data || !dictionaries || isLeaf) return {}; // No data available yet

    const counts: Counts = {};
    for (let i = 0; i < data.length; i++) {
      if (
        (!institutionFilter || data.institutioncode[i] === institutionFilter) &&
        (!basisOfRecordFilter || data.basisofrecord[i] === basisOfRecordFilter) &&
        (!yearFilter || (data.year[i] >= yearFilter[0] && data.year[i] <= yearFilter[1])) &&
        (data[selectedTaxon.level][i] === selectedTaxon.id)
      ) {
        if (!counts[data[symbolizeBy][i]]) counts[data[symbolizeBy][i]] = 0;
        counts[data[symbolizeBy][i]] += 1;
      }
    }
    return counts;
  }, [data, dictionaries, institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon, symbolizeBy]);
};

export default useCount;
