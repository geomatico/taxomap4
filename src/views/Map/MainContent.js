import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';

import {tableFromIPC} from 'apache-arrow';

import BaseMapPicker from '@geomatico/geocomponents/BaseMapPicker';

import {DATA_PROPS, INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES, TAXONOMIC_LEVELS} from '../../config';
import useApplyColors from '../../hooks/useApplyColors';
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';
import LegendSelector from '../../components/LegendSelector';
import YearSlider from '../../components/YearSlider';
import {DataFilterExtension} from '@deck.gl/extensions';

const cssStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

const rangeSliderContainer = {
  position: 'absolute',
  left: '12px',
  bottom: '20px',
  background: 'white',
  width: '400px',
  borderRadius: '3px'
};
const legendSelectorContainer = {
  position: 'absolute',
  right: '12px',
  bottom: '20px'
};


const MainContent = ({institutionFilter, basisOfRecordFilter, taxonFilter}) => {

  const {t} = useTranslation();
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [arrowTable, setArrowTable] = useState();

  const [symbolizeBy, setSymbolizeBy] = useState('phylum');
  const [yearFilter, setYearFilter] = useState();

  const applyColors = useApplyColors(symbolizeBy);

  const mapRef = useRef(null);
  const handleMapResize = () => window.setTimeout(() => mapRef?.current?.resize(), 0);

  useEffect(() => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', evt => evt.preventDefault());
  }, []);

  useEffect(() => {
    tableFromIPC(fetch('data/taxomap_ultralite.arrow')).then(setArrowTable);
  }, []);

  const data = useMemo(() => {
    return arrowTable && {
      length: arrowTable.numRows,
      attributes: {
        getPosition: {
          value: arrowTable.getChild('geometry').getChildAt(0).data[0].values,
          size: 2
        },
        getFillColor: {
          value: applyColors(arrowTable.getChild(symbolizeBy[0]).data[0].values),
          size: 3
        }
      },
      ...Object.keys(DATA_PROPS).reduce((acc, field) => {
        acc[field] = arrowTable.getChild(DATA_PROPS[field]).data[0].values;
        return acc;
      }, {})
    };
  }, [arrowTable, symbolizeBy]);


  const years = data && data.year.filter(y => y !== 0);
  const fullYearRange = useMemo(() => {
    return data && [years.reduce((n, m) => Math.min(n, m), Number.POSITIVE_INFINITY), years.reduce((n, m) => Math.max(n, m), -Number.POSITIVE_INFINITY)];
  }, [data]);

  useEffect(() => {
    if (fullYearRange?.length) setYearFilter(fullYearRange);
  }, [fullYearRange]);

  const deckLayers = useMemo(() => ([
    new ScatterplotLayer({
      id: 'data',
      data: data,
      antialias: false,
      getRadius: 4,
      radiusUnits: 'pixels',
      stroked: true,
      getLineColor: [255, 255, 255],
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      extensions: [new DataFilterExtension({filterSize: 4})],
      getFilterValue: (_, {
        index,
        data
      }) => [
        data.year[index],
        data.institutioncode[index],
        data.basisofrecord[index],
        taxonFilter?.level === undefined ? 1 : data[taxonFilter.level][index]
      ],
      filterRange: [
        yearFilter === undefined ? [0, 999999] : yearFilter,
        institutionFilter === undefined ? [0, 999999] : [institutionFilter, institutionFilter],
        basisOfRecordFilter === undefined ? [0, 999999] : [basisOfRecordFilter, basisOfRecordFilter],
        taxonFilter?.id === undefined ? [0, 999999] : [taxonFilter.id, taxonFilter.id]
      ],
      updateTriggers: {
        getFilterValue: [taxonFilter?.level]
      }
    })
  ]), [data, yearFilter, institutionFilter, basisOfRecordFilter, taxonFilter]);

  const translatedSyles = MAPSTYLES.map(style => ({
    ...style,
    label: t('mapStyles.' + style.label)
  }));

  return <>
    <DeckGL
      layers={deckLayers}
      initialViewState={INITIAL_VIEWPORT}
      controller style={cssStyle}
      onResize={handleMapResize}
    >
      <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} mapLib={maplibregl} ref={mapRef}/>
    </DeckGL>
    <BaseMapPicker
      position='top-right'
      direction='down'
      styles={translatedSyles}
      selectedStyleId={mapStyle}
      onStyleChange={setMapStyle}
    />
    <Box sx={rangeSliderContainer}>
      {yearFilter &&
        <YearSlider
          yearRange={yearFilter}
          minYear={fullYearRange ? fullYearRange[0] : 0}
          maxYear={fullYearRange ? fullYearRange[1] : 0}
          onYearRangeChange={setYearFilter}
        />
      }
    </Box>
    <Box sx={legendSelectorContainer}>
      <LegendSelector symbolizeBy={symbolizeBy} onSymbolizeByChange={setSymbolizeBy}/>
    </Box>
  </>;
};

MainContent.propTypes = {
  institutionFilter: PropTypes.number,
  basisOfRecordFilter: PropTypes.number,
  yearFilter: PropTypes.arrayOf(PropTypes.number),
  onYearFilterChange: PropTypes.func,
  taxonFilter: PropTypes.shape({
    level: PropTypes.oneOf(TAXONOMIC_LEVELS).isRequired,
    id: PropTypes.number.isRequired
  })
};

export default MainContent;
