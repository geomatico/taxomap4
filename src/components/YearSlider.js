import React from 'react';
import PropTypes from 'prop-types';

import RangeSlider from '@geomatico/geocomponents/RangeSlider';

export const YearSlider = ({yearRange, onYearRangeChange, minYear, maxYear}) => {

  return <RangeSlider
    onValueChange={onYearRangeChange}
    value={yearRange}
    min={minYear}
    max={maxYear}
    animationInterval={150}
    sx={{'&.RangeSlider-root': {padding: '10px 21px'}}}
  />;
};

YearSlider.propTypes = {
  yearRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  minYear: PropTypes.number.isRequired,
  maxYear: PropTypes.number.isRequired,
  onYearRangeChange: PropTypes.func.isRequired
};

export default YearSlider;
