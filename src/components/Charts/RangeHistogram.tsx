import React, {FC, SyntheticEvent, useLayoutEffect, useRef, useState} from 'react';
import 'react-resizable/css/styles.css';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {styled} from '@mui/material/styles';
import {cyan} from '@mui/material/colors';
import {SxProps} from '@mui/system';
import RangeSlider from '@geomatico/geocomponents/Forms/RangeSlider';
import {Range} from '../../commonTypes';

//STYLES
const DEFAULT_HEIGHT = 200;

const classes = {
  root: 'RangeHistogram-root',
  barContainer: 'RangeHistogram-barContainer',
  barGroupSelected: 'RangeHistogram-barGroupSelected',
  barGroupNoSelected: 'RangeHistogram-barGroupNoSelected',
  barRange: 'RangeHistogram-barRange',
  barWithinRange: 'RangeHistogram-barWithinRange',
  barOutOfRange: 'RangeHistogram-barOutOfRange',
  tooltip: 'RangeHistogram-tooltip',
};

interface RootProps {
  height: number;
}

const Root = styled(
  Box,
  {shouldForwardProp: (prop) => prop !== 'height'}
)<RootProps>(({height, theme}) => {
  return {

    '& .RangeHistogram-barContainer': {
      display: 'flex',
      paddingLeft: '1px',
      transform: 'rotateX(180deg)',
      //background: '#000000a6'
    },
    '& .RangeHistogram-barGroupSelected': {
      position: 'relative',
      backgroundColor: '#a297971f',
      width: '100%',
      height: height,
      paddingBottom: '16px'
    },
    '& .RangeHistogram-barGroupNoSelected': {
      backgroundColor: 'transparent',
      width: '100%',
      height: height,
      paddingBottom: '16px'
    },
    '& .RangeHistogram-barRange': {
      flex: 1,
      margin: '1px',
    },
    '& .RangeHistogram-barWithinRange': {
      backgroundColor: cyan[300],
      '&:hover': {
        backgroundColor: theme.palette.grey[300]
      },
    },
    '& .RangeHistogram-barOutOfRange': {
      backgroundColor: theme.palette.grey[500],
      '&:hover': {
        backgroundColor: '#a2979773'
      },
    },
    '& .MuiSlider-rail': {display: 'none'},
    '& .MuiSlider-track': {display: 'none'},
    '& .RangeSlider-slider': {p: 0},
    p: '0 !important',
    color: '#3a8589',
    '& .MuiSlider-thumb': {
      transform: 'translate(-50%, -100%)',
      height: height,
      outline: 'unset',
      width: '4px',
      backgroundColor: 'transparent',
      padding: '8px',
      borderRadius: '4px',
      '&.Mui-focusVisible': {
        boxShadow: 'none',
      },
      '&:hover': {
        boxShadow: 'none',
      },
      '&:focus-visible': {
        outline: 'unset',
        boxShadow: 'none',
      },
    },
    '& .Mui-active': {
      boxShadow: 'none',
    },
    '&.Mui-focusVisible': {
      boxShadow: 'none',
    },
    '& .MuiSlider-thumb::after': {
      width: '0px'
    },
    '& .MuiSlider-mark': {
      width: '2px',
      height: '200px'
    },
    '& .MuiSlider-markActive': {
      width: '1px',
      height: '10px'
    }
  };
});

export type RangeHistogramProps = {
  value: Range,
  onValueChange: (range: number | Range) => void,
  onChangeCommitted: (range: number | Range) => void,
  height: number,
  data: Record<number, number>,
  minMax?: Range,
  sx?: SxProps
}

export type RangeHistogramBarProps = {
  isSelected: boolean,
  heightBar: number,
  value: number | undefined,
  year: number,
}

const HistogramBar: FC<RangeHistogramBarProps> = ({isSelected, value, year, heightBar = DEFAULT_HEIGHT}) => {
  return <Tooltip title={'Any: ' + year + ' valor: ' + (value || 0)} placement='top' arrow className={classes.tooltip}>
    <Box
      className={`${classes.barRange} ${isSelected ? classes.barWithinRange : classes.barOutOfRange}`}
      style={{height: heightBar >= 1 ? `${heightBar}%` : '1px'}}
    />
  </Tooltip>;
};

const RangeHistogram: FC<RangeHistogramProps> = ({data, value, minMax, height = DEFAULT_HEIGHT, onValueChange, onChangeCommitted, sx = {},}) => {

  // AXIS X
  const axisXItems = Object.keys(data).map(el => parseInt(el));
  const maxAxisX = minMax ? minMax[1] : Math.max(...axisXItems); // si manda minMax, tiene preferencia, sino se calcula el min y max del data
  const minAxisX = minMax ? minMax[0] : Math.min(...axisXItems);

  //AXIS Y
  const maxAxisY = Math.max(...Object.values(data)) || 300;

  const getHeight = (value: number) => (value / maxAxisY) * 100;
  const isSelected = (v: number) => v >= value[0] && v <= value[1];
  const targetRef = useRef();
  const [barWidth, setDimensions] = useState(0);

  const allYears: Array<number> = [];

  for (let i = minAxisX; i <= maxAxisX; i++) {
    allYears.push(i);
  }

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions((targetRef.current as HTMLElement)?.offsetWidth);
    }
  }, []);

  const rangeSliderStyles = {
    p: `${barWidth / 2}px !important`,
    '& .RangeSlider-textRange': {
      color: 'white'
    },
    '& .MuiSvgIcon-root': {
      color: 'white',
    },
    '& .MuiSlider-root': {
      p: '0 !important',
      color: 'transparent',
    }
  };

  const handleOnRangeChange =(range: number | Range)=> {
    onValueChange(range);
  };

  return <Root className={classes.root} sx={sx} height={height}>
    <Box className={classes.barContainer}>
      {
        allYears.map((year) =>
          <Box ref={targetRef} key={year} className={isSelected(year) ? classes.barGroupSelected : classes.barGroupNoSelected}>
            <HistogramBar value={data[year]} year={year} heightBar={getHeight(data[year])} isSelected={isSelected(year)}/>
            {year === value[0] &&
              <Box sx={{
                position: 'absolute',
                bottom: height - 5,
                left: '-5px',
                backgroundColor: 'white',
                height: '10px',
                width: '10px',
                borderRadius: 5
              }}/>
            }
            {year === value[1] &&
              <Box sx={{
                position: 'absolute',
                bottom: height - 5,
                right: '-5px',
                backgroundColor: 'white',
                height: '10px',
                width: '10px',
                borderRadius: 5
              }}/>
            }
          </Box>
        )
      }
    </Box>
    <RangeSlider sx={rangeSliderStyles} value={value} min={minAxisX} max={maxAxisX} onChangeCommitted={(event: Event | SyntheticEvent<Element, Event>, value: number | number[])=> onChangeCommitted(value as Range)} onValueChange={handleOnRangeChange}/>
  </Root>;
};

export default RangeHistogram;