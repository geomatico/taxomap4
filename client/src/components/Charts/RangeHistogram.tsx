import React, {FC, useLayoutEffect, useRef, useState, memo, useMemo, useCallback} from 'react';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {cyan} from '@mui/material/colors';
import {SxProps} from '@mui/system';
import RangeSlider from '@geomatico/geocomponents/Forms/RangeSlider';
import {Range} from '../../commonTypes';

const DEFAULT_HEIGHT = 200;

const classes = {
  root: 'RangeHistogram-root',
  barContainer: 'RangeHistogram-barContainer'
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
      transform: 'rotateX(180deg)'
    },
    '& .bar-group-selected': {
      position: 'relative',
      backgroundColor: '#a297971f',
      width: '100%',
      height: height,
      paddingBottom: '16px'
    },
    '& .bar-group-no-selected': {
      backgroundColor: 'transparent',
      width: '100%',
      height: height,
      paddingBottom: '16px'
    },
    '& .bar-range': {
      flex: 1,
      margin: '1px',
      cursor: 'default'
    },
    '& .bar-within-range': {
      backgroundColor: cyan[300],
      '&:hover': {
        backgroundColor: theme.palette.grey[300]
      }
    },
    '& .bar-out-of-range': {
      backgroundColor: theme.palette.grey[500],
      '&:hover': {
        backgroundColor: '#a2979773'
      }
    },
    '& .custom-tooltip': {
      position: 'fixed',
      backgroundColor: 'rgba(97, 97, 97, 0.95)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      pointerEvents: 'none',
      zIndex: 9999,
      whiteSpace: 'nowrap',
      transform: 'translate(-50%, -100%)',
      marginTop: '-8px',
      opacity: 0,
      transition: 'opacity 0.15s'
    },
    '& .custom-tooltip.visible': {
      opacity: 1
    },
    '& .custom-tooltip::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '50%',
      marginLeft: '-4px',
      borderWidth: '4px',
      borderStyle: 'solid',
      borderColor: 'rgba(97, 97, 97, 0.95) transparent transparent transparent'
    },
    '& .range-marker': {
      position: 'absolute',
      bottom: height - 5,
      backgroundColor: 'white',
      height: '10px',
      width: '10px',
      borderRadius: '5px'
    },
    '& .range-marker-start': {
      left: '-5px'
    },
    '& .range-marker-end': {
      right: '-5px'
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
        boxShadow: 'none'
      },
      '&:hover': {
        boxShadow: 'none'
      },
      '&:focus-visible': {
        outline: 'unset',
        boxShadow: 'none'
      }
    },
    '& .Mui-active': {
      boxShadow: 'none'
    },
    '&.Mui-focusVisible': {
      boxShadow: 'none'
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
  onValueChange: (range: Range) => void,
  onChangeCommitted: (range: Range) => void,
  height: number,
  data: Record<number, number>,
  sx?: SxProps
}

type RangeHistogramBarProps = {
  isSelected: boolean,
  heightBar: number,
  value: number,
  year: number,
  onMouseEnter: (e: React.MouseEvent, year: number, value: number) => void,
  onMouseMove: (e: React.MouseEvent) => void,
  onMouseLeave: () => void,
}

// Memoized bar component - only re-renders if props change
const HistogramBar: FC<RangeHistogramBarProps> = memo(({
  isSelected,
  value,
  year,
  heightBar = DEFAULT_HEIGHT,
  onMouseEnter,
  onMouseMove,
  onMouseLeave
}) => {
  return (
    <div
      className={`bar-range ${isSelected ? 'bar-within-range' : 'bar-out-of-range'}`}
      style={{height: heightBar >= 1 ? `${heightBar}%` : '1px'}}
      onMouseEnter={(e) => onMouseEnter(e, year, value)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    />
  );
});

HistogramBar.displayName = 'HistogramBar';

const RangeHistogram: FC<RangeHistogramProps> = ({
  data,
  value,
  height = DEFAULT_HEIGHT,
  onValueChange,
  onChangeCommitted,
  sx = {}
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [barWidth, setDimensions] = useState(0);

  // Memoize expensive calculations
  const {maxAxisX, minAxisX, maxAxisY, allYears} = useMemo(() => {
    const axisXItems = Object.keys(data).map(el => parseInt(el));
    const maxAxisX = Math.max(...axisXItems);
    const minAxisX = Math.min(...axisXItems);
    const maxAxisY = Math.max(...Object.values(data));

    const allYears: Array<number> = [];
    for (let i = minAxisX; i <= maxAxisX; i++) {
      allYears.push(i);
    }

    return {axisXItems, maxAxisX, minAxisX, maxAxisY, allYears};
  }, [data]);

  const getHeight = useCallback((value: number) => (value / maxAxisY) * 100, [maxAxisY]);
  const isSelected = useCallback((v: number) => v >= value[0] && v <= value[1], [value]);

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions(targetRef.current.offsetWidth);
    }
  }, []);

  // Lightweight tooltip handlers
  const handleMouseEnter = useCallback((e: React.MouseEvent, year: number, val: number) => {
    if (tooltipRef.current) {
      tooltipRef.current.textContent = `Any: ${year} valor: ${val || 0}`;
      tooltipRef.current.classList.add('visible');

      // Position at cursor
      const tooltip = tooltipRef.current;
      const tooltipWidth = tooltip.offsetWidth;
      const viewportWidth = window.innerWidth;

      let left = e.clientX;

      // Check if tooltip would overflow on the right
      if (left + tooltipWidth / 2 > viewportWidth - 10) {
        left = viewportWidth - tooltipWidth / 2 - 10;
      }

      // Check if tooltip would overflow on the left
      if (left - tooltipWidth / 2 < 10) {
        left = tooltipWidth / 2 + 10;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${e.clientY}px`;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (tooltipRef.current && tooltipRef.current.classList.contains('visible')) {
      const tooltip = tooltipRef.current;
      const tooltipWidth = tooltip.offsetWidth;
      const viewportWidth = window.innerWidth;

      let left = e.clientX;

      // Check if tooltip would overflow on the right
      if (left + tooltipWidth / 2 > viewportWidth - 10) {
        left = viewportWidth - tooltipWidth / 2 - 10;
      }

      // Check if tooltip would overflow on the left
      if (left - tooltipWidth / 2 < 10) {
        left = tooltipWidth / 2 + 10;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${e.clientY}px`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.classList.remove('visible');
    }
  }, []);

  const rangeSliderStyles = useMemo(() => ({
    p: `${barWidth / 2}px !important`,
    '& .MuiSlider-root': {
      p: '0 !important',
      color: 'transparent'
    },
    '& .RangeSlider-textRange': {
      color: 'white'
    },
    '& .RangeSlider-iconRange': {
      color: 'white'
    }
  }), [barWidth]);

  return (
    <Root className={classes.root} sx={sx} height={height}>
      <div className={classes.barContainer}>
        {allYears.map((year) => {
          const selected = isSelected(year);
          const barHeight = getHeight(data[year]);

          return (
            <div
              ref={year === allYears[0] ? targetRef : null}
              key={year}
              className={selected ? 'bar-group-selected' : 'bar-group-no-selected'}
            >
              <HistogramBar
                value={data[year]}
                year={year}
                heightBar={barHeight}
                isSelected={selected}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
              {year === value[0] && <div className="range-marker range-marker-start"/>}
              {year === value[1] && <div className="range-marker range-marker-end"/>}
            </div>
          );
        })}
      </div>
      <div ref={tooltipRef} className="custom-tooltip"/>
      <RangeSlider
        sx={rangeSliderStyles}
        value={value}
        min={minAxisX}
        max={maxAxisX}
        onChangeCommitted={(e, v) => Array.isArray(v) && onChangeCommitted([v[0], v[1]])}
        onValueChange={onValueChange}
      />
    </Root>
  );
};

export default memo(RangeHistogram);
