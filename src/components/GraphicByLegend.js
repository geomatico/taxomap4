import React from 'react';
import PropTypes from 'prop-types';
import PieChart from './PieChart';
import useCount from '../hooks/useCount';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, TAXONOMIC_LEVELS} from '../config';
import useArrowData from '../hooks/useArrowData';
import useDictionaries from '../hooks/useDictionaries';

const calculatePercentage = (partialValue, total) => partialValue * 100 / total;

const GraphicByLegend = ({institutionFilter, basisOfRecordFilter, yearFilter, taxonFilter, symbolizeBy}) => {
  const data = useArrowData();
  const dictionaries = useDictionaries();

  const totals = useCount({data, dictionaries, institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon: taxonFilter, symbolizeBy});

  const sumTotalresults = Object.keys(totals).length && Object.values(totals).reduce((a, b) => a + b);

  const formattedForChart = Object.keys(totals).length && Object.entries(totals).map(([key, value]) => {
    let elementConf = {};
    if (symbolizeBy === 'institutioncode') {
      elementConf = INSTITUTION_LEGEND.find(el => el.id === parseInt(key));
    } else if (symbolizeBy === 'basisofrecord') {
      elementConf = BASIS_OF_RECORD_LEGEND.find(el => el.id === parseInt(key));
    }

    return {
      color: elementConf.color,
      label: elementConf.id,
      id: elementConf.id,
      percentage: calculatePercentage(value, sumTotalresults)
    };
  });

  return <> {formattedForChart && <PieChart data={formattedForChart}/>}</>;
};

GraphicByLegend.propTypes = {
  institutionFilter: PropTypes.number,
  basisOfRecordFilter: PropTypes.number,
  yearFilter: PropTypes.arrayOf(PropTypes.number),
  symbolizeBy: PropTypes.string,
  taxonFilter: PropTypes.shape({
    level: PropTypes.oneOf(TAXONOMIC_LEVELS).isRequired,
    id: PropTypes.number.isRequired
  })
};

GraphicByLegend.defaultProps = {};

export default GraphicByLegend;