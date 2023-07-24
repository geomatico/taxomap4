import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import BaseMapPicker from '@geomatico/geocomponents/BaseMapPicker';
import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES, TAXONOMIC_LEVELS} from '../../config';
import useApplyColor from '../../hooks/useApplyColor';
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';
import LegendSelector from '../../components/LegendSelector';
import YearSlider from '../../components/YearSlider';
import {DataFilterExtension} from '@deck.gl/extensions';
import useDictionaries from '../../hooks/useDictionaries';
import useArrowData from '../../hooks/useArrowData';
import {debounce} from 'throttle-debounce';
import GraphicByLegend from '../../components/GraphicByLegend';

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
  bottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
};


const MainContent = ({institutionFilter, basisOfRecordFilter, yearFilter, onYearFilterChange, taxonFilter, onBBOXChanged}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [symbolizeBy, setSymbolizeBy] = useState('institutioncode');

  const {t} = useTranslation();
  const dictionaries = useDictionaries();
  const mapRef = useRef(null);
  const applyColor = useApplyColor(symbolizeBy);
  const data = useArrowData();

  const notifyChanges = useCallback(debounce(30, map => {
    onBBOXChanged(map.getBounds().toArray().flatMap(a => a));
  }), []);

  // On data or viewport change, recalculate data
  useEffect(() => {
    if (mapRef && mapRef.current) {
      notifyChanges(mapRef.current);
    }
  }, [viewport, mapRef?.current]); // FIXME preguntar a oscar si esto cuadra mapRef?.current

  const handleMapResize = () => window.setTimeout(() => mapRef?.current?.resize(), 0);

  const getTooltip = info => {
    if (!info || !info.picked) return;

    const itemId = data.id[info.index];
    const speciesId = data.species[info.index];
    const species = dictionaries.species.find(el => el.id === speciesId);
    const institutionId = data.institutioncode[info.index];
    const institution = dictionaries.institutioncode.find(el => el.id === institutionId);

    return `${itemId}
            ${species?.name}
            ${institution?.name}`;
  };

  useEffect(() => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', evt => evt.preventDefault());
  }, []);

  const years = data && data.year.filter(y => y !== 0);
  const fullYearRange = useMemo(() => {
    return data && [years.reduce((n, m) => Math.min(n, m), Number.POSITIVE_INFINITY), years.reduce((n, m) => Math.max(n, m), -Number.POSITIVE_INFINITY)];
  }, [data]);

  useEffect(() => {
    if (fullYearRange?.length) onYearFilterChange(fullYearRange);
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
      getFillColor: (_, {
        index,
        data,
        target
      }) => applyColor(data[symbolizeBy][index], target),
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
        getFillColor: [symbolizeBy],
        getFilterValue: [taxonFilter?.level]
      },
      pickable: true
    })
  ]), [data, symbolizeBy, yearFilter, institutionFilter, basisOfRecordFilter, taxonFilter, dictionaries]);

  const translatedSyles = MAPSTYLES.map(style => ({
    ...style,
    label: t('mapStyles.' + style.label)
  }));

  return <>
    <DeckGL
      layers={deckLayers}
      initialViewState={viewport}
      onViewStateChange={({viewState}) => setViewport(viewState)}
      controller style={cssStyle}
      onResize={handleMapResize}
      getTooltip={getTooltip}
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
          onYearRangeChange={onYearFilterChange}
        />
      }
    </Box>
    <Box sx={legendSelectorContainer}>

      <LegendSelector symbolizeBy={symbolizeBy} onSymbolizeByChange={setSymbolizeBy}>
        <GraphicByLegend
          institutionFilter={institutionFilter}
          basisOfRecordFilter={basisOfRecordFilter}
          yearFilter={yearFilter}
          taxonFilter={taxonFilter}
          symbolizeBy={symbolizeBy}
        />
      </LegendSelector>
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
  }),
  onBBOXChanged: PropTypes.func,
  childrenVisibility: PropTypes.objectOf(PropTypes.bool),
};

export default MainContent;
