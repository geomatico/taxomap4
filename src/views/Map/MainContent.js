import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';

import {tableFromIPC} from 'apache-arrow';

import BaseMapPicker from '@geomatico/geocomponents/BaseMapPicker';

import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import useApplyColors from '../../hooks/useApplyColors';
import Box from '@mui/material/Box';
import LegendSelector from '../../components/LegendSelector';
import YearSlider from '../../components/YearSlider';

const cssStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

// TODO de donde saco estos años?
const years = [1990, 1991, 1992, 1993, 1994, 1995];

const MainContent = ({ institutionFilter, basisOfRecordFilter, taxonFilter}) => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [arrowTable, setArrowTable] = useState();

  const [symbolizeBy, setSymbolizeBy] = useState('phylum');
  const [yearRange, setYearRange] = useState([1992, 1994]);

  const applyColors = useApplyColors(symbolizeBy);

  console.log('Applied Filters:', JSON.stringify({yearRange, institutionFilter, basisOfRecordFilter, taxonFilter})); // TODO MCNB-62 Aplicar filtros a los datos del mapa

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
        getFillColor:  {
          value: applyColors(arrowTable.getChild(symbolizeBy[0]).data[0].values),
          size: 3
        }
      }
    };
  }, [arrowTable, symbolizeBy]);

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
      lineWidthUnits: 'pixels'
    })
  ]), [data]);

  return <>
    <DeckGL layers={deckLayers} initialViewState={INITIAL_VIEWPORT} controller style={cssStyle} onResize={handleMapResize}>
      <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} mapLib={maplibregl} ref={mapRef}/>
    </DeckGL>
    <BaseMapPicker
      position='top-right'
      direction='down'
      styles={MAPSTYLES}
      selectedStyleId={mapStyle}
      onStyleChange={setMapStyle}
    />
    <Box sx={{position: 'absolute', left: '12px', bottom: '20px', background: 'white', width: '400px', borderRadius: '3px'}}>
      <YearSlider years={years} yearRange={yearRange} onYearRangeChange={setYearRange}/>
    </Box>
    <Box sx={{position: 'absolute', right: '12px', bottom: '20px'}}>
      <LegendSelector symbolizeBy={symbolizeBy} onSymbolizeByChange={setSymbolizeBy}/>
    </Box>
  </>;
};

MainContent.propTypes = {
  institutionFilter: PropTypes.number,
  basisOfRecordFilter: PropTypes.number,
  taxonFilter: PropTypes.shape({
    level: PropTypes.oneOf(['domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'subspecies']).isRequired,
    id: PropTypes.number.isRequired
  })
};

export default MainContent;
