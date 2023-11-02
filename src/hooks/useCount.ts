import {BBOX, Dictionaries, Filters, GroupBy, TaxomapData, TaxonomicLevel} from '../commonTypes';
import {useMemo} from 'react';

type UseCountParams = {
  data: TaxomapData | undefined,
  dictionaries: Dictionaries,
  filters: Filters,
  groupBy: GroupBy
};

type Counts = Record<number, number>;

const isInsideOfBBOX = (BBOX: BBOX, x: number, y: number): boolean => {
  const [xMin, yMin, xMax, yMax] = BBOX;
  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

const useCount = ({data, dictionaries, filters, groupBy}: UseCountParams): Counts => {
  return useMemo(() => {
    const isLeaf = filters.taxon.level === TaxonomicLevel.subspecies;
    if (!data || !dictionaries || isLeaf) return {}; // No data available yet

    const counts: Counts = {};
    for (let i = 0; i < data.length; i++) {
      const lon = data.attributes.getPosition.value[2 * i]; // x
      const lat = data.attributes.getPosition.value[2 * i + 1]; // y
      if (
        (!filters.institutionId || data.institutioncode[i] === filters.institutionId) &&
        (!filters.basisOfRecordId || data.basisofrecord[i] === filters.basisOfRecordId) &&
        (!filters.yearRange || (data.year[i] >= filters.yearRange[0] && data.year[i] <= filters.yearRange[1])) &&
        (data[filters.taxon.level][i] === filters.taxon.id) &&
        (!filters.subtaxonVisibility || filters.subtaxonVisibility.isVisible[data[filters.subtaxonVisibility.subtaxonLevel][i]]) &&
        (!filters.bbox || isInsideOfBBOX(filters.bbox, lon, lat))
      ) {
        if (!counts[data[groupBy][i]]) counts[data[groupBy][i]] = 0;
        counts[data[groupBy][i]] += 1;
      }
    }
    return counts;
  }, [data, dictionaries, filters, groupBy]);
};

export default useCount;
