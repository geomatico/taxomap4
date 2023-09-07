import React, {FC} from 'react';
import {Range} from '../commonTypes';
import Box from '@mui/material/Box';
import RangeHistogram from '@geomatico/geocomponents/Charts/RangeHistogram';

export interface RangeSliderProps {
  yearRange?: Range,
  onYearRangeChange: (newRange?: Range) => void,
  data: Record<number, number>
}

export const YearSlider: FC<RangeSliderProps> = ({data, yearRange, onYearRangeChange}) => {

  // AXIS X
  const axisXItems = Object.keys(data).map(el => parseInt(el));
  const max = Math.max(...axisXItems);
  const min = Math.min(...axisXItems);

  //Cuando despues de arrastrar se suelta el slider
  const handleOnChangeCommitted = (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      if (newValue[0] === min && newValue[1] === max) {
        onYearRangeChange(undefined); // full selection => set undefined years
      } else {
        onYearRangeChange(newValue as Range);
      }
    }
  };

  // todos los pasos que va dando
  const handleOnRangeChange= (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      if (newValue[0] === min && newValue[1] === max) {
        //setInternalRange(undefined); // full selection => set undefined years
      } else {
        onYearRangeChange(newValue as Range);
      }
    }
  };

  //borra el primer registro con el total
  delete data['0'];

  return <Box sx={{p: 1, pb: 0, background: '#333333e0', borderRadius: '3px'}}>
    {data && yearRange?.length &&
      <RangeHistogram onValueChange={handleOnRangeChange} onChangeCommitted={handleOnChangeCommitted} value={yearRange} height={50} data={data}/>
    }
  </Box>;
};

export default YearSlider;
