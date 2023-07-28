import {
  BBOX,
  Dictionaries,
  SubtaxonVisibility,
  GroupBy,
  TaxomapData,
  Taxon,
  TaxonomicLevel,
  YearRange
} from '../commonTypes';
import {useMemo} from 'react';

type UseCountParam = {
  data: TaxomapData | undefined,
  dictionaries: Dictionaries,
  institutionFilter?: number,
  basisOfRecordFilter?: number,
  yearFilter?: YearRange,
  selectedTaxon: Taxon,
  subtaxonVisibility?: SubtaxonVisibility,
  groupBy: GroupBy,
  BBOX?: BBOX
};

type Counts = Record<number, number>;

const isInsideOfBBOX = (BBOX: BBOX, x: number, y: number): boolean => {
  const [xMin, yMin, xMax, yMax] = BBOX;
  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

const useCount = ({
  data,
  dictionaries,
  institutionFilter,
  basisOfRecordFilter,
  yearFilter,
  selectedTaxon,
  subtaxonVisibility,
  groupBy,
  BBOX
}: UseCountParam): Counts => {
  return useMemo(() => {
    const isLeaf = selectedTaxon.level === TaxonomicLevel.subspecies;
    if (!data || !dictionaries || isLeaf) return {}; // No data available yet

    const counts: Counts = {};
    for (let i = 0; i < data.length; i++) {
      const lon = data.attributes.getPosition.value[2 * i]; // x
      const lat = data.attributes.getPosition.value[2 * i + 1]; // y
      if (
        (!institutionFilter || data.institutioncode[i] === institutionFilter) &&
        (!basisOfRecordFilter || data.basisofrecord[i] === basisOfRecordFilter) &&
        (!yearFilter || (data.year[i] >= yearFilter[0] && data.year[i] <= yearFilter[1])) &&
        (data[selectedTaxon.level][i] === selectedTaxon.id) &&
        (!BBOX || isInsideOfBBOX(BBOX, lon, lat))
      ) {
        if (!counts[data[groupBy][i]]) counts[data[groupBy][i]] = 0;
        counts[data[groupBy][i]] += 1;
      }
    }
    return counts;
  }, [data, dictionaries, institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon, groupBy, BBOX, subtaxonVisibility]);
};

export default useCount;
