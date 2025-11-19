import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Popup} from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {ScatterplotLayer} from '@deck.gl/layers/typed';
import BaseMapPicker from '@geomatico/geocomponents/Map/BaseMapPicker';
import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import useApplyColor from '../../hooks/useApplyColor';
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';
import LegendSelector from '../../components/LegendSelector';
import YearSlider from '../../components/YearSlider';
import {DataFilterExtension} from '@deck.gl/extensions/typed';
import useDictionaries from '../../hooks/useDictionaries';
import useArrowData from '../../hooks/useArrowData';
import {debounce} from 'throttle-debounce';
import GraphicByLegend from '../../components/GraphicByLegend';
import {Accessor, WebMercatorViewport} from '@deck.gl/core/typed';
import {DeckGLProps} from '@deck.gl/react/typed';
import styled from '@mui/styles/styled';

import {
  BBOX,
  Dictionaries,
  FilterBy,
  Filters,
  Range,
  RGBAArrayColor,
  SymbolizeBy,
  TaxomapData,
  Viewport
} from '../../commonTypes';

import DeckGLMap from '@geomatico/geocomponents/Map/DeckGLMap';

import PopUpContent, {SelectedFeature} from '../../components/PopUpContent';
import useCount from '../../hooks/useCount';

const PopupInfo = styled(Popup)({
  cursor: 'default',
  '& .mapboxgl-popup-content': {
    padding: 0
  }
});

const rangeSliderContainer = {
  position: 'absolute',
  left: '12px',
  bottom: '20px',
  background: 'transparent',
  width: '600px',
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

type MainContentProps = {
  filters : Filters,
  isTactile: boolean,
  onYearFilterChange: (range?: Range) => void,
  onBBOXChanged: (bbox: BBOX) => void,
};

const MainContent: FC<MainContentProps> = ({filters, isTactile, onYearFilterChange, onBBOXChanged }) => {
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState<string>(INITIAL_MAPSTYLE_URL);
  const [symbolizeBy, setSymbolizeBy] = useState<SymbolizeBy>(SymbolizeBy.institutioncode);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature>();

  const {t} = useTranslation();
  const dictionaries: Dictionaries = useDictionaries();
  const applyColor = useApplyColor(symbolizeBy);
  const data: TaxomapData | undefined = useArrowData();

  const fullYearRange: Range | undefined = useMemo(() => {
    const years = data?.year.filter(year => year > 0).sort();
    return years ? [years[0], years[years.length - 1]] : undefined;
  }, [data]);

  const countByYear = useCount({
    data,
    dictionaries,
    filters: {...filters, yearRange: fullYearRange},
    groupBy: FilterBy.year
  });

  const handleViewportChange = (viewport : Viewport) => onBBOXChanged(new WebMercatorViewport(viewport).getBounds());
  const notifyChanges = useCallback(debounce(200, handleViewportChange), []);
  useEffect(() => notifyChanges(viewport), [viewport]);

  useEffect(() => {
    document
      ?.getElementById('deckgl-wrapper')
      ?.addEventListener('contextmenu', evt => evt.preventDefault());
  }, []);


  const deckLayers = useMemo(() => ([
    new ScatterplotLayer<TaxomapData, {
      getFilterValue: Accessor<TaxomapData, number | number[]>,
      filterRange: Array<number | number []>
    }>({
      id: 'data',
      data: data,
      getRadius: isTactile ? 7 : 4,
      radiusUnits: 'pixels',
      stroked: true,
      getLineColor: [255, 255, 255],
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      getFillColor: (_, {
        index,
        data,
        target
      }) => applyColor((data as TaxomapData)[symbolizeBy][index], target as RGBAArrayColor),
      extensions: [new DataFilterExtension({filterSize: 4})],
      getFilterValue: (_, {
        index,
        data
      }) => [
        (data as TaxomapData).year[index],
        (data as TaxomapData).institutioncode[index],
        (data as TaxomapData).basisofrecord[index],
        //taxonFilter?.level === undefined ? 1 : (data as TaxomapData)[taxonFilter.level][index]
        !filters.subtaxonVisibility || filters.subtaxonVisibility.isVisible[(data as TaxomapData)[filters.subtaxonVisibility.subtaxonLevel][index]] === true ? 1 : 0
      ],
      filterRange: [
        filters.yearRange === undefined ? [0, 999999] : filters.yearRange,
        filters.institutionId === undefined ? [0, 999999] : [filters.institutionId, filters.institutionId],
        filters.basisOfRecordId === undefined ? [0, 999999] : [filters.basisOfRecordId, filters.basisOfRecordId],
        [1, 1]
      ],
      updateTriggers: {
        getFillColor: [symbolizeBy],
        getFilterValue: [filters.subtaxonVisibility]
      },
      pickable: true
    })
  ]), [data, symbolizeBy, filters, dictionaries]);

  const translatedSyles = MAPSTYLES.map(style => ({
    ...style,
    label: t('mapStyles.' + style.label)
  }));

  const getElementData = (index: number) => {
    if (!data) return null;
    const id = data.id[index];
    const catalognumber = data.catalognumber[index];
    const speciesId = data.species[index];
    const species = dictionaries.species.find(el => el.id === speciesId);
    const institutioncodeId = data.institutioncode[index];
    const institutioncode = dictionaries.institutioncode.find(el => el.id === institutioncodeId);
    return {
      id,
      catalognumber,
      species,
      institutioncode
    };
  };

  const deckProps: Omit<DeckGLProps, 'style' | 'ref' | 'layers' | 'controller' | 'viewState' | 'onViewStateChange' | 'onWebGLInitialized' | 'glOptions' | 'onResize'> = useMemo(() => ({
    controller: {doubleClickZoom: false},
    onClick: (info, e) => {
      if (e.target.className.includes && e.target.className.includes('mapboxgl-canvas')) {
        if (info.picked) {
          const elementData = getElementData(info.index);
          const newFeature: SelectedFeature = {
            ...elementData,
            lat: info.coordinate ? info.coordinate[1] : undefined,
            lon: info.coordinate ? info.coordinate[0] : undefined
          };
          setSelectedFeature(newFeature);
        }
      }
    },
    getCursor: ({isDragging, isHovering}: {
      isDragging: boolean,
      isHovering: boolean
    }) => (isDragging ? 'grabbing' : (isHovering ? 'pointer' : 'grab'))
  }), [selectedFeature, data]);


  return <>
    <DeckGLMap
      mapStyle={mapStyle}
      deckLayers={deckLayers}
      viewport={viewport}
      onViewportChange={setViewport}
      deckProps={deckProps}
    >
      {selectedFeature && selectedFeature?.lat && selectedFeature?.lon &&
        <PopupInfo
          latitude={selectedFeature?.lat}
          longitude={selectedFeature?.lon}
          maxWidth="500"
          closeOnClick={false}
          anchor="top"
          onClose={() => setSelectedFeature(undefined)}
        >
          <PopUpContent selectedFeature={selectedFeature} isTactile={isTactile}/>
        </PopupInfo>
      }
    </DeckGLMap>

    <BaseMapPicker
      position="top-right"
      direction="down"
      styles={translatedSyles}
      selectedStyleId={mapStyle}
      onStyleChange={setMapStyle}
    />
    <Box sx={rangeSliderContainer}>
      {fullYearRange ?
        <YearSlider
          yearRange={filters.yearRange}
          fullYearRange={fullYearRange}
          onYearRangeChange={onYearFilterChange}
          data={countByYear}
        /> : null
      }
    </Box>
    <Box sx={legendSelectorContainer}>

      <LegendSelector symbolizeBy={symbolizeBy} onSymbolizeByChange={setSymbolizeBy}>
        <GraphicByLegend filters={filters} symbolizeBy={symbolizeBy}/>
      </LegendSelector>
    </Box>
  </>;
};

export default MainContent;
