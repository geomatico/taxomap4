import React, {FC} from 'react';
import PieChart, {ChartData} from './Charts/PieChart';
import useCount from '../hooks/useCount';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND} from '../config';
import useArrowData from '../hooks/useArrowData';
import useDictionaries from '../hooks/useDictionaries';
import {Filters, LegendItem, SymbolizeBy, TaxomapData} from '../commonTypes';

const calculatePercentage = (partialValue: number, total: number) => partialValue * 100 / total;

export interface GraphicByLegendProps {
  filters : Filters,
  symbolizeBy: SymbolizeBy,
}

const GraphicByLegend: FC<GraphicByLegendProps> = ({filters, symbolizeBy}) => {
  const data: TaxomapData | undefined = useArrowData();
  const dictionaries = useDictionaries();

  const totals = useCount({data, dictionaries, filters, groupBy: symbolizeBy});

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
