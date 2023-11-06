import React, {FC} from 'react';
import {Range} from '../commonTypes';
import Box from '@mui/material/Box';
import RangeHistogram from './Charts/RangeHistogram';

export interface RangeSliderProps {
  yearRange?: Range,
  fullYearRange?: Range,
  onYearRangeChange: (newRange?: Range) => void,
  data: Record<number, number>
}

const equals = (a: Range | undefined, b: Range | undefined): boolean =>
  (a && b && a[0] === b[0] && a[1] === b[1]) || false;

export const YearSlider: FC<RangeSliderProps> = ({data, yearRange, fullYearRange, onYearRangeChange}) => {
  const handleYearRangeChanged = (range: Range | undefined) => {
    if (equals(range, fullYearRange)) {
      onYearRangeChange(undefined);
    } else {
      onYearRangeChange(range);
    }
  };

  return <Box sx={{p: 1, pb: 0, background: '#333333e0', borderRadius: '3px'}}>
    {data && fullYearRange &&
      <RangeHistogram onValueChange={handleYearRangeChanged}
        // TODO quitar este handler cuando se use Geocomponents > 3.0.4 (FRONT-71)
        onChangeCommitted={handleYearRangeChanged}
        value={(yearRange || fullYearRange)} minMax={fullYearRange} height={50} data={data}/>
    }
  </Box>;
};

export default YearSlider;
