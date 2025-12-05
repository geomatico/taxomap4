import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactMapGL, {_MapContext as MapContext, Popup, ViewState} from 'react-map-gl';
import {ScatterplotLayer} from '@deck.gl/layers/typed';
import {HeatmapLayer} from '@deck.gl/aggregation-layers/typed';
import {DataFilterExtension} from '@deck.gl/extensions/typed';

import Box from '@mui/material/Box';
import {debounce} from 'throttle-debounce';
import {Accessor, PickingInfo, WebMercatorViewport} from '@deck.gl/core/typed';

import styled from '@mui/styles/styled';

import BaseMapPicker from '@geomatico/geocomponents/Map/BaseMapPicker';

import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import {
  BBOX,
  FilterBy,
  Filters, Lang,
  MapType,
  Range,
  RGBAArrayColor,
  SymbolizeBy,
  TaxomapData,
  Viewport
} from '../../commonTypes';

import YearSlider from '../../components/YearSlider';
import PopUpContent, {SelectedFeature} from '../../components/PopUpContent';
import Legend from '../../components/Legend';

import useTaxonDictionaries from '../../hooks/useTaxonDictionaries';
import useArrowData from '../../hooks/useArrowData';
import {useTranslation} from 'react-i18next';
import useCount from '../../hooks/useCount';
import useApplyColor from '../../hooks/useApplyColor';

import DeckGL from '@deck.gl/react/typed';
import useLegends from '../../hooks/useLegends';
import useFilterDictionaries from '../../hooks/useFilterDictionaries';

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
  isTactile: boolean,
  onYearFilterChange: (range?: Range) => void,
  onBBOXChanged: (bbox: BBOX) => void,
};

const MainContent: FC<MainContentProps> = ({filters, isTactile, onYearFilterChange, onBBOXChanged }) => {
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState<string>(INITIAL_MAPSTYLE_URL);
  const [symbolizeBy, setSymbolizeBy] = useState<SymbolizeBy>(SymbolizeBy.institutioncode);
  const [selectedMapType, setMapType] = useState<MapType>(MapType.discreteData);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature>();

  const {t, i18n: {language}} = useTranslation();
  const taxonDictionaries = useTaxonDictionaries();
  const filterDictionaries = useFilterDictionaries();
  const legends = useLegends(language as Lang);
  const data = useArrowData();

  const applyColor = useApplyColor(legends, symbolizeBy);

  const fullYearRange: Range | undefined = useMemo(() => {
    const years = data?.year.filter(year => year > 0).sort();
    return years ? [years[0], years[years.length - 1]] : undefined;
  }, [data]);
  
  const countByYear = useCount({
    data,
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
  
  const heatMapLayer = [
    new HeatmapLayer<TaxomapData, {
        getFilterValue: Accessor<TaxomapData, number | number[]>,
        filterRange: Array<number | number[]>
      }>({
        id: 'Heatmap',
        data,
        aggregation: 'SUM',
        radiusPixels: 50,
        intensity: 5,
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
  const discreteDataLayer = [
    new ScatterplotLayer<TaxomapData, {
        getFilterValue: Accessor<TaxomapData, number | number[]>,
        filterRange: Array<number | number[]>
      }>({
        id: 'data',
        data,
        getRadius: isTactile ? 7 : 4,
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
          getFillColor: [symbolizeBy, legends],
          getFilterValue: [filters.subtaxonVisibility]
        },
        pickable: true
      }) 
  ];

  const deckLayers = useMemo(() => {
    switch (selectedMapType) {
      
    case MapType.densityMap:
      return heatMapLayer;
    /*case MapType.aggregateData:
      return aggregateDataLayer;*/
    case MapType.discreteData:
      return discreteDataLayer;
    default:
      return discreteDataLayer;
    }
  }, [selectedMapType, data, symbolizeBy, filters, legends]);

  const translatedSyles = MAPSTYLES.map(style => ({
    ...style,
    label: t('mapStyles.' + style.label)
  }));

  const getElementData = (index: number) => {
    if (!data) return null;
    const id = data.id[index];
    const catalognumber = data.catalognumber[index];
    const speciesId = data.species[index];
    const species = taxonDictionaries.species.find(el => el.id === speciesId);
    const institutioncodeId = data.institutioncode[index];
    const institutioncode = filterDictionaries.institutioncode.find(el => el.id === institutioncodeId);
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
        mapLib={maplibregl}
        style={{width: '100%', height: '100%'}}
        mapStyle={mapStyle}
        interactive={false}
      />
      {
        selectedMapType === MapType.discreteData && selectedFeature && selectedFeature?.lat && selectedFeature?.lon &&
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
    </DeckGL>
    <BaseMapPicker
      position="top-right"
      direction="down"
      styles={translatedSyles}
      selectedStyleId={mapStyle}
      onStyleChange={setMapStyle}
    />
    <Box sx={rangeSliderContainer}>
      {data ?
        <YearSlider
          yearRange={filters.yearRange}
          onYearRangeChange={onYearFilterChange}
          data={countByYear}
        /> : null
      }
    </Box>
    <Box sx={legendSelectorContainer}>
      <Legend symbolizeBy={symbolizeBy} filters={filters} onSymbolizeByChange={setSymbolizeBy}
        selectedMapType={selectedMapType} onMapTypeChange={setMapType}/>
    </Box>
  </>;
};

export default MainContent;



