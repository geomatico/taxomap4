import React, {FC} from 'react';
import PieChart, {ChartData} from './Charts/PieChart';
import useCount from '../hooks/useCount';
import useArrowData from '../hooks/useArrowData';
import useDictionaries from '../hooks/useDictionaries';
import {Filters, LegendItem, SymbolizeBy, TaxomapData} from '../commonTypes';
import useLegends from '../hooks/useLegends';

const calculatePercentage = (partialValue: number, total: number) => partialValue * 100 / total;

export interface GraphicByLegendProps {
  filters : Filters,
  symbolizeBy: SymbolizeBy,
}

const GraphicByLegend: FC<GraphicByLegendProps> = ({filters, symbolizeBy}) => {
  const data: TaxomapData | undefined = useArrowData();
  const dictionaries = useDictionaries();
  const legends = useLegends();

  const totals = useCount({data, dictionaries, filters, groupBy: symbolizeBy});

  const sumTotalresults = Object.keys(totals).length && Object.values(totals).reduce((a, b) => a + b);

  const formattedForChart: ChartData = (Object.keys(totals).length
    ? Object.entries(totals).map(([key, value]) => {
      let elementConf: LegendItem | undefined = {} as LegendItem;

      if (symbolizeBy === 'institutioncode') {
        elementConf = legends.institutionlegend.find(el => el.id === parseInt(key));
      } else if (symbolizeBy === 'basisofrecord') {
        elementConf = legends.basisOfRecordLegend.find(el => el.id === parseInt(key));
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
  
  return <>
    {
      formattedForChart.length > 0
        ? <PieChart data={formattedForChart}/>
        : null
    }
  </>;
};

GraphicByLegend.defaultProps = {};

export default GraphicByLegend;
