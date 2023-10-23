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

  //Cuando despues de arrastrar se suelta el slider
  // TODO quitar este handler cuando se use Geocomponents > 3.0.4 (FRONT-71)
  const handleOnChangeCommitted = (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2 && fullYearRange) {
      if (newValue[0] === min && newValue[1] === max ) {
        onYearRangeChange(fullYearRange); // full selection => fullYearRange
      } else {
        onYearRangeChange(newValue as Range);
      }
    }
  };

  // todos los pasos que va dando
  const handleOnRangeChange= (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2 && fullYearRange) {
      if (newValue[0] === min && newValue[1] === max ) {
        onYearRangeChange(fullYearRange); // full selection => fullYearRange
      } else {
        onYearRangeChange(newValue as Range);
      }
    }
  };

  //borra el primer registro con el total
  delete data['0'];

  return <Box sx={{p: 1, pb: 0, background: '#333333e0', borderRadius: '3px'}}>
    {data && yearRange?.length &&
      <RangeHistogram onValueChange={handleOnRangeChange} onChangeCommitted={handleOnChangeCommitted} value={yearRange} minMax={fullYearRange} height={50} data={data}/>
    }
  </Box>;
};

export default YearSlider;
