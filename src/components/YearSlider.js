import React from 'react';
import PropTypes from 'prop-types';

import RangeSlider from '@geomatico/geocomponents/RangeSlider';


export const YearSlider = ({years, yearRange, onYearRangeChange}) => {

  return <RangeSlider onValueChange={onYearRangeChange} value={yearRange} min={years[0]} max={years[years.length -1]} animationInterval={0}/>;
};

YearSlider.propTypes = {
  years: PropTypes.arrayOf(PropTypes.number),
  yearRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  onYearRangeChange: PropTypes.func.isRequired
};

export default YearSlider;
