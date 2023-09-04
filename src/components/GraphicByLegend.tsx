import React, {FC} from 'react';
import PieChart, {ChartData} from './Charts/PieChart';
import useCount from '../hooks/useCount';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND} from '../config';
import useArrowData from '../hooks/useArrowData';
import useDictionaries from '../hooks/useDictionaries';
import {BBOX, LegendItem, SubtaxonVisibility, SymbolizeBy, TaxomapData, Taxon, YearRange} from '../commonTypes';

const calculatePercentage = (partialValue: number, total: number) => partialValue * 100 / total;

export interface GraphicByLegendProps {
  taxonFilter: Taxon,
  subtaxonVisibility?: SubtaxonVisibility,
  symbolizeBy: SymbolizeBy,
  institutionFilter?: number,
  basisOfRecordFilter?: number,
  yearFilter?: YearRange,
  BBOX?: BBOX
}

const GraphicByLegend:FC<GraphicByLegendProps> = ({institutionFilter, basisOfRecordFilter, yearFilter, taxonFilter, subtaxonVisibility, symbolizeBy, BBOX}) => {
  const data: TaxomapData | undefined = useArrowData();
  const dictionaries = useDictionaries();

  const totals = useCount({data, dictionaries, institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon: taxonFilter, subtaxonVisibility, groupBy: symbolizeBy, BBOX});

  const sumTotalresults = Object.keys(totals).length && Object.values(totals).reduce((a, b) => a + b);

  const formattedForChart: ChartData = (Object.keys(totals).length
    ? Object.entries(totals).map(([key, value]) => {
      let elementConf: LegendItem | undefined = {} as LegendItem;

      if (symbolizeBy === 'institutioncode') {
        elementConf = INSTITUTION_LEGEND.find(el => el.id === parseInt(key));
      } else if (symbolizeBy === 'basisofrecord') {
        elementConf = BASIS_OF_RECORD_LEGEND.find(el => el.id === parseInt(key));
      }
      if (!elementConf) return undefined;

      return {
        color: elementConf.color,
        label: elementConf.id?.toString(),
        id: elementConf.id,
        percentage: calculatePercentage(value, sumTotalresults)
      };
    }).filter(el => el !== undefined)
    : []) as ChartData;

  return <>{
    formattedForChart.length > 0
      ? <PieChart data={formattedForChart}/>
      : null
  }</>;
};

GraphicByLegend.defaultProps = {};

export default GraphicByLegend;
