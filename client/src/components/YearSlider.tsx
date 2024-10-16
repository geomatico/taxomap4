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

export const YearSlider: FC<RangeSliderProps> = ({data, yearRange, fullYearRange, onYearRangeChange}) => {
  const isFullYearRange = (range?: Range) => range !== undefined && fullYearRange !== undefined && range[0] === fullYearRange[0] && range[1] === fullYearRange[1];

  // Full range sets year filter to undefined so records with year == null are also taken into account
  const handleYearRangeChanged = (range?: Range) => onYearRangeChange(isFullYearRange(range) ? undefined : range);

  return <Box sx={{p: 1, pb: 0, background: '#333333e0', borderRadius: '3px'}}>
    {data && fullYearRange &&
      <RangeHistogram
        onValueChange={handleYearRangeChanged}
        onChangeCommitted={handleYearRangeChanged} // TODO quitar este handler cuando se use Geocomponents > 3.0.4 (FRONT-71)
        value={(yearRange || fullYearRange)}
        minMax={fullYearRange}
        height={50}
        data={data}
      />
    }
  </Box>;
};

export default YearSlider;
