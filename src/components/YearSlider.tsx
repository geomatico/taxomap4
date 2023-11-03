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

  // AXIS X
  const axisXItems = Object.keys(data).map(el => parseInt(el));
  const max = Math.max(...axisXItems);
  const min = Math.min(...axisXItems);

  const handleYearRangeChanged = (range: Range | undefined) => {
    if (range && range[0] === min && range[1] === max) {
      onYearRangeChange(undefined);
    } else {
      onYearRangeChange(range);
    }
  };

  // Cuando despues de arrastrar se suelta el slider
  // TODO quitar este handler cuando se use Geocomponents > 3.0.4 (FRONT-71)
  const handleOnChangeCommitted = handleYearRangeChanged;

  // todos los pasos que va dando
  const handleOnRangeChange = handleYearRangeChanged;

  // borra el primer registro con el total
  delete data['0'];

  return <Box sx={{p: 1, pb: 0, background: '#333333e0', borderRadius: '3px'}}>
    {data && fullYearRange &&
      <RangeHistogram onValueChange={handleOnRangeChange} onChangeCommitted={handleOnChangeCommitted}
        value={(yearRange || fullYearRange)} minMax={fullYearRange} height={50} data={data}/>
    }
  </Box>;
};

export default YearSlider;
