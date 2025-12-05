import React, {FC} from 'react';
import {Range} from '../commonTypes';
import Box from '@mui/material/Box';
import RangeHistogram from './Charts/RangeHistogram';

interface Props {
  yearRange?: Range,
  onYearRangeChange: (newRange?: Range) => void,
  data: Record<number, number>
}

export const YearSlider: FC<Props> = ({data, yearRange, onYearRangeChange}) => {
  const fullSpan: Range = Object.keys(data).map(year => parseInt(year)).reduce((acc, curr) => {
    return [Math.min(acc[0], curr), Math.max(acc[1], curr)];
  }, [9999, 0]);

  const isFullSpan = (range?: Range) => range !== undefined && fullSpan !== undefined && range[0] <= fullSpan[0] && range[1] >= fullSpan[1];

  // Full span unsets year filter so records without date are also count
  const handleYearRangeChanged = (range?: Range) => {
    onYearRangeChange(isFullSpan(range) ? undefined : range);
  };

  return <Box sx={{p: 1, pb: 0, background: '#333333e0', borderRadius: '3px'}}>
    {data && fullSpan &&
      <RangeHistogram
        data={data}
        value={(yearRange || fullSpan)}
        onValueChange={handleYearRangeChanged}
        onChangeCommitted={handleYearRangeChanged}
        height={50}
      />
    }
  </Box>;
};

export default YearSlider;
