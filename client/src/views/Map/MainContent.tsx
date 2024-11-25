import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactMapGL, { Popup, _MapContext as MapContext, ViewState } from 'react-map-gl';
import {ScatterplotLayer} from '@deck.gl/layers/typed';
import {HeatmapLayer, ScreenGridLayer} from '@deck.gl/aggregation-layers/typed';
import {DataFilterExtension} from '@deck.gl/extensions/typed';

import Box from '@mui/material/Box';
import {debounce} from 'throttle-debounce';
import {Accessor, PickingInfo, WebMercatorViewport} from '@deck.gl/core/typed';

import styled from '@mui/styles/styled';

import BaseMapPicker from '@geomatico/geocomponents/Map/BaseMapPicker';

import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import {
  BBOX,
  Dictionaries,
  FilterBy, Filters, MapType,
  Range,
  RGBAArrayColor,
  SymbolizeBy,
  TaxomapData,
  Viewport
} from '../../commonTypes';

import YearSlider from '../../components/YearSlider';
import PopUpContent, {SelectedFeature} from '../../components/PopUpContent';
import Legend from '../../components/Legend';

import useDictionaries from '../../hooks/useDictionaries';
import useArrowData from '../../hooks/useArrowData';
import {useTranslation} from 'react-i18next';
import useCount from '../../hooks/useCount';
import useApplyColor from '../../hooks/useApplyColor';

import DeckGL from '@deck.gl/react/typed';

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
  bottom: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

type MainContentProps = {
  filters : Filters,
  onYearFilterChange: (range?: Range) => void,
  onBBOXChanged: (bbox: BBOX) => void,
};

const MainContent: FC<MainContentProps> = ({filters, onYearFilterChange, onBBOXChanged }) => {
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState<string>(INITIAL_MAPSTYLE_URL);
  const [symbolizeBy, setSymbolizeBy] = useState<SymbolizeBy>(SymbolizeBy.institutioncode);
  const [selectedMapType, setMapType] = useState<MapType>(MapType.discreteData);
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

  const handleViewportChange = (viewport: Viewport) => onBBOXChanged(new WebMercatorViewport(viewport).getBounds());

  const notifyChanges = useCallback(debounce(200, handleViewportChange), []);
  useEffect(() => notifyChanges(viewport), [viewport]);

  useEffect(() => {
    document
      ?.getElementById('deckgl-wrapper')
      ?.addEventListener('contextmenu', evt => evt.preventDefault());
  }, []);
  
  const deckLayers = useMemo(() => {
    switch (selectedMapType) {
      
    case MapType.heatMap:
      return [new HeatmapLayer<TaxomapData, {
        getFilterValue: Accessor<TaxomapData, number | number[]>,
        filterRange: Array<number | number[]>
      }>({
        id: 'Heatmap',
        data,
        aggregation: 'SUM',
        radiusPixels: 50,
        opacity: 0.5,
        extensions: [new DataFilterExtension({ filterSize: 4 })],
        getFilterValue: (_, { index, data }) => [
          (data as TaxomapData).year[index],
          (data as TaxomapData).institutioncode[index],
          (data as TaxomapData).basisofrecord[index],
          !filters.subtaxonVisibility || filters.subtaxonVisibility.isVisible[(data as TaxomapData)[filters.subtaxonVisibility.subtaxonLevel][index]] === true ? 1 : 0
        ],
        filterRange: [
          filters.yearRange === undefined ? [0, 999999] : filters.yearRange,
          filters.institutionId === undefined ? [0, 999999] : [filters.institutionId, filters.institutionId],
          filters.basisOfRecordId === undefined ? [0, 999999] : [filters.basisOfRecordId, filters.basisOfRecordId],
          [1, 1]
        ],
        updateTriggers: {
          getFilterValue: [filters.subtaxonVisibility]
        }
      })];
    case MapType.aggregateData:
      return [
        new ScreenGridLayer<TaxomapData, {
          getFilterValue: Accessor<TaxomapData, number | number[]>,
          filterRange: Array<number | number[]>
        }>({
          id: 'ScreenGridLayer',
          data,
          cellSizePixels: 50,
          colorRange: [
            [0, 25, 0, 25],
            [0, 85, 0, 85],
            [0, 127, 0, 127],
            [0, 170, 0, 170],
            [0, 190, 0, 190],
            [0, 255, 0, 255]
          ],
          opacity: 0.8,
          extensions: [new DataFilterExtension({ filterSize: 4 })],
          getFilterValue: (_, { index, data }) => [
            (data as TaxomapData).year[index],
            (data as TaxomapData).institutioncode[index],
            (data as TaxomapData).basisofrecord[index],
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
          }
        })    
      ];
    default:
      return [
        new ScatterplotLayer<TaxomapData, {
        getFilterValue: Accessor<TaxomapData, number | number[]>,
        filterRange: Array<number | number[]>
      }>({
        id: 'data',
        data,
        getRadius: 4,
        radiusUnits: 'pixels',
        stroked: true,
        getLineColor: [255, 255, 255],
        getLineWidth: 1,
        lineWidthUnits: 'pixels',
        getFillColor: (_, { index, data, target }) => applyColor((data as TaxomapData)[symbolizeBy][index], target as RGBAArrayColor),
        extensions: [new DataFilterExtension({ filterSize: 4 })],
        getFilterValue: (_, { index, data }) => [
          (data as TaxomapData).year[index],
          (data as TaxomapData).institutioncode[index],
          (data as TaxomapData).basisofrecord[index],
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
      ];

    }
  }, [selectedMapType, data, symbolizeBy, filters, dictionaries]);

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

  const handleClick = (info: PickingInfo) => {
    if (info.layer) {
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
  };

  const getCursor = ({isDragging, isHovering}: {
      isDragging: boolean,
      isHovering: boolean
    }) => (isDragging ? 'grabbing' : (isHovering ? 'pointer' : 'grab'));

  return <>
    <DeckGL
      layers={deckLayers}
      controller={{doubleClickZoom: false}}
      viewState={viewport}
      onViewStateChange={({viewState}) => setViewport(viewState as ViewState)}
      ContextProvider={MapContext.Provider}
      onClick={handleClick}
      getCursor={getCursor}
    >
      <ReactMapGL
        mapLib={import('maplibre-gl')}
        style={{width: '100%', height: '100%'}}
        mapStyle={mapStyle}
        interactive={false}
      />
      {
        selectedMapType !== MapType.discreteData && selectedFeature && selectedFeature?.lat && selectedFeature?.lon &&
        <PopupInfo
          latitude={selectedFeature?.lat}
          longitude={selectedFeature?.lon}
          maxWidth="500"
          closeOnClick={false}
          anchor="top"
          onClose={() => setSelectedFeature(undefined)}
        >
          <PopUpContent selectedFeature={selectedFeature}/>
        </PopupInfo>
      }
    </DeckGL>
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
      <Legend symbolizeBy={symbolizeBy} filters={filters} onSymbolizeByChange={setSymbolizeBy} selectedMapType={selectedMapType} onMapTypeChange={setMapType}/>
    </Box>
  </>;
};

export default MainContent;



