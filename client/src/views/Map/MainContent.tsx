import React, {FC, useCallback, useEffect, useMemo, useState, createContext} from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import DeckGL from '@deck.gl/react/typed';
import {ScatterplotLayer} from '@deck.gl/layers/typed';
import {HeatmapLayer} from '@deck.gl/aggregation-layers/typed';
import {DataFilterExtension} from '@deck.gl/extensions/typed';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {debounce} from 'throttle-debounce';
import {Accessor, PickingInfo, WebMercatorViewport} from '@deck.gl/core/typed';
import {MjolnirEvent} from 'mjolnir.js';

/*import Map, {Popup} from 'react-map-gl';*/
import styled from '@mui/styles/styled';

import BaseMapPicker from '@geomatico/geocomponents/Map/BaseMapPicker';

import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import {
  BBOX,
  Dictionaries,
  FilterBy, Filters,
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Map, {Popup} from 'react-map-gl';

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
  bottom: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};
const aggregationButton = {
  width: '100%',
  bgcolor: 'white',
  '&:hover': { bgcolor: 'grey.100'}
};

type MainContentProps = {
  filters : Filters,
  onYearFilterChange: (range?: Range) => void,
  isAggregatedData: boolean
  onBBOXChanged: (bbox: BBOX) => void,
  onAggregatedDataChange: () => void
};

const MainContent: FC<MainContentProps> = ({filters, isAggregatedData, onYearFilterChange, onBBOXChanged, onAggregatedDataChange }) => {
  const [viewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState<string>(INITIAL_MAPSTYLE_URL);
  const [symbolizeBy, setSymbolizeBy] = useState<SymbolizeBy>(SymbolizeBy.institutioncode);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature>();

  /*const MapContext = createContext({viewport: INITIAL_VIEWPORT, setViewport: (viewport: Viewport) => {}});*/
  
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

  const deckLayers = useMemo(() => {
    if (isAggregatedData) {
      return [
        new HeatmapLayer<TaxomapData, {
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
        pickable: true
      })
      ];
    } else {
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
  }, [isAggregatedData, data, symbolizeBy, filters, dictionaries]);

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

  const handleClick = (info: PickingInfo, e: MjolnirEvent) => {
    console.log('e', e);
    console.log('info', info);
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
    {/*<MapContext.Provider value={{viewport, setViewport}}>*/}
    <DeckGL
      initialViewState={viewport}
      layers={deckLayers} 
      controller={{doubleClickZoom: false}}
      onClick={handleClick}
      getCursor={getCursor}
    >
      <Map
        mapLib={import('maplibre-gl')}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        interactive={false}
      >
        {
          !isAggregatedData && selectedFeature && selectedFeature?.lat && selectedFeature?.lon &&
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
      </Map>
    </DeckGL>
    {/*</MapContext.Provider>*/}
    
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
      <Legend isAggregatedData={isAggregatedData} symbolizeBy={symbolizeBy} filters={filters} onSymbolizeByChange={setSymbolizeBy}/>
      <Button sx={aggregationButton} variant='outlined' onClick={onAggregatedDataChange}>{isAggregatedData? 'DATOS DISCRETOS' : 'DATOS AGREGADOS'}</Button>
    </Box>
  </>;
};

export default MainContent;



