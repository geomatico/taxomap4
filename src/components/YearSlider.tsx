import React, {FC} from 'react';
import {YearRange} from '../commonTypes';
import RangeHistogram from './Charts/RangeHistogram';
import Box from '@mui/material/Box';

export type RangeSliderProps = {
  minYear: number,
  maxYear: number,
  yearRange?: YearRange,
  onYearRangeChange: (newRange?: YearRange) => void,
  data: Record<number, number>
}

export const YearSlider: FC<RangeSliderProps> = ({data, yearRange, onYearRangeChange, minYear, maxYear}) => {
  const handleValueChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      if (newValue[0] === minYear && newValue[1] === maxYear) {
        onYearRangeChange(undefined); // full selection => set undefined years
      } else {
        onYearRangeChange(newValue as YearRange);
      }
    }
  };

  delete data['0'];

  return <Box sx={{p: 1, pb: 0, background: '#333333e0', borderRadius: '3px'}}>
    {data && yearRange?.length &&
      <RangeHistogram onRangeChange={handleValueChange} range={yearRange} max={maxYear} min={minYear} height={50} data={data}/>
    }
  </Box>;
};

export default YearSlider;
