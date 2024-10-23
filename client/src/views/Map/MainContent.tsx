import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Popup} from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {ScatterplotLayer} from '@deck.gl/layers/typed';
import BaseMapPicker from '@geomatico/geocomponents/Map/BaseMapPicker';
import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import useApplyColor from '../../hooks/useApplyColor';
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';
import YearSlider from '../../components/YearSlider';
import {DataFilterExtension} from '@deck.gl/extensions/typed';
import useDictionaries from '../../hooks/useDictionaries';
import useArrowData from '../../hooks/useArrowData';
import {debounce} from 'throttle-debounce';
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
import {HexagonLayer} from '@deck.gl/aggregation-layers/typed';
import Legend from '../../components/Legend';
import Button from '@mui/material/Button';


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

  /*const getAggregatedPosition = (lat: number, lon: number, target: Position) => {
    console.log('lat', lat);
    console.log('lon', lon);
    target[0]=0;
    target[1]=0;
    /!*target[0]=Number(lat);
    target[1]=Number(lon);*!/
    //return target;
  };*/

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
        new HexagonLayer({
          id: 'data-aggregate',
          data,
          //data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
          extruded: true,
          getPosition: () => [42, 3],
          /*getPosition: (_, {index, data, target}) => getAggregatedPosition(
            (data as TaxomapData).attributes.getPosition.value[index*2],
            (data as TaxomapData).attributes.getPosition.value[(index*2)+1],
            target as Position),*/
          /* getPosition: (_, {index, data}) => [
            Number((data as TaxomapData).attributes.getPosition.value[index*2]),
            Number((data as TaxomapData).attributes.getPosition.value[(index*2)+1]),
          ],*/
          elevationScale: 25,
          radius: 100,
          pickable: true,
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
      deckProps={isAggregatedData ? undefined: deckProps}
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
          <PopUpContent selectedFeature={selectedFeature}/>
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
      <Legend isAggregatedData={isAggregatedData} symbolizeBy={symbolizeBy} filters={filters} onSymbolizeByChange={setSymbolizeBy}/>
      <Button sx={aggregationButton} variant='outlined' onClick={onAggregatedDataChange}>{isAggregatedData? 'DATOS DISCRETOS' : 'DATOS AGREGADOS'}</Button>
    </Box>
  </>;
};

export default MainContent;
