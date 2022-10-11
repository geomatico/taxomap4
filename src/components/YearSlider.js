import React from 'react';
import PropTypes from 'prop-types';

import RangeSlider from '@geomatico/geocomponents/RangeSlider';
import {MAX_YEAR, MIN_YEAR} from '../config';

export const YearSlider = ({yearRange, onYearRangeChange}) => {

  return <RangeSlider
    onValueChange={onYearRangeChange}
    value={yearRange}
    min={MIN_YEAR}
    max={MAX_YEAR}
    animationInterval={400}
    sx={{'&.RangeSlider-root' : {padding: '10px 21px'}} }
  />;
};

YearSlider.propTypes = {
  yearRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  onYearRangeChange: PropTypes.func.isRequired
};

export default YearSlider;
