import React, {FC} from 'react';
import RangeSlider from '@geomatico/geocomponents/Forms/RangeSlider';
import {YearRange} from '../commonTypes';

export type RangeSliderProps = {
  minYear: number,
  maxYear: number,
  yearRange?: YearRange,
  onYearRangeChange: (newRange?: YearRange) => void
}

export const YearSlider: FC<RangeSliderProps> = ({yearRange, onYearRangeChange, minYear, maxYear}) => {

  const handleValueChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      if (newValue[0] === minYear && newValue[1] === maxYear) {
        onYearRangeChange(undefined); // full selection => set undefined years
      } else {
        onYearRangeChange(newValue as YearRange);
      }
    }
  };

  const value = yearRange ?? [minYear, maxYear]; // undefined years => set full selection

  return <RangeSlider
    onValueChange={handleValueChange}
    value={value}
    min={minYear}
    max={maxYear}
    animationInterval={150}
    sx={{'&.RangeSlider-root': {padding: '10px 21px'}}}
  />;
};

export default YearSlider;
