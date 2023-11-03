import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MapRef, Popup} from 'react-map-gl';
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
import {Accessor} from '@deck.gl/core/typed';
import {DeckGLProps} from '@deck.gl/react/typed';
import styled from '@mui/styles/styled';

import {
  BBOX,
  Dictionaries,
  FilterBy,
  Range,
  RGBAArrayColor,
  SubtaxonVisibility,
  SymbolizeBy,
  TaxomapData,
  Taxon,
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
  institutionFilter?: number,
  basisOfRecordFilter?: number,
  yearFilter?: Range,
  onYearFilterChange: (range?: Range) => void,
  taxonFilter: Taxon,
  BBOX?: BBOX,
  onBBOXChanged: (bbox: BBOX) => void,
  subtaxonVisibility?: SubtaxonVisibility
};

const MainContent: FC<MainContentProps> = ({
  institutionFilter,
  basisOfRecordFilter,
  yearFilter,
  onYearFilterChange,
  taxonFilter,
  BBOX,
  onBBOXChanged,
  subtaxonVisibility
}) => {
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState<string>(INITIAL_MAPSTYLE_URL);
  const [symbolizeBy, setSymbolizeBy] = useState<SymbolizeBy>(SymbolizeBy.institutioncode);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature>();


  const {t} = useTranslation();
  const dictionaries: Dictionaries = useDictionaries();
  const mapRef = useRef<MapRef>(null);
  const applyColor = useApplyColor(symbolizeBy);
  const data: TaxomapData | undefined = useArrowData();

  const years = data && data.year.filter(year => year > 0);
  const fullYearRange = useMemo(() => data && years && [
    years.reduce((n, m) => Math.min(n, m), Number.POSITIVE_INFINITY),
    years.reduce((n, m) => Math.max(n, m), -Number.POSITIVE_INFINITY)
  ] as Range, [data]);

  const countByYear = useCount(
    {
      data, dictionaries, institutionFilter,
      basisOfRecordFilter, yearFilter: fullYearRange,
      subtaxonVisibility, groupBy: FilterBy.year, selectedTaxon: taxonFilter, BBOX
    });

  const notifyChanges = useCallback(debounce(30, (map: MapRef) => {
    const bounds = map.getBounds();
    onBBOXChanged([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
  }), []);

  // On data or viewport change, recalculate data
  useEffect(() => {
    if (mapRef && mapRef.current) {
      notifyChanges(mapRef.current);
    }
  }, [viewport, mapRef?.current]);

  const getTooltip = (info: {
    index: number;
    picked: boolean;
  }) => {

    if (!info || !info.picked || !data || selectedFeature) return null;

    const catalognumber = data.catalognumber[info.index];
    const speciesId = data.species[info.index];
    const species = dictionaries.species.find(el => el.id === speciesId);
    const institutionId = data.institutioncode[info.index];
    const institution = dictionaries.institutioncode.find(el => el.id === institutionId);
    return `${catalognumber}
            ${!species?.name ? '' : species?.name}
            ${institution?.name || ''}`;
  };

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
        !subtaxonVisibility || subtaxonVisibility.isVisible[(data as TaxomapData)[subtaxonVisibility.subtaxonLevel][index]] === true ? 1 : 0
      ],
      filterRange: [
        yearFilter === undefined ? [0, 999999] : yearFilter,
        institutionFilter === undefined ? [0, 999999] : [institutionFilter, institutionFilter],
        basisOfRecordFilter === undefined ? [0, 999999] : [basisOfRecordFilter, basisOfRecordFilter],
        [1, 1]
      ],
      updateTriggers: {
        getFillColor: [symbolizeBy],
        getFilterValue: [subtaxonVisibility]
      },
      pickable: true
    })
  ]), [data, symbolizeBy, yearFilter, institutionFilter, basisOfRecordFilter, taxonFilter, dictionaries, subtaxonVisibility]);

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
    }) => (isDragging ? 'grabbing' : (isHovering ? 'pointer' : 'grab')),
    getTooltip: getTooltip
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
          yearRange={yearFilter}
          fullYearRange={fullYearRange}
          onYearRangeChange={onYearFilterChange}
          data={countByYear}
        /> : null
      }
    </Box>
    <Box sx={legendSelectorContainer}>

      <LegendSelector symbolizeBy={symbolizeBy} onSymbolizeByChange={setSymbolizeBy}>
        <GraphicByLegend
          institutionFilter={institutionFilter}
          basisOfRecordFilter={basisOfRecordFilter}
          yearFilter={yearFilter}
          taxonFilter={taxonFilter}
          subtaxonVisibility={subtaxonVisibility}
          symbolizeBy={symbolizeBy}
          BBOX={BBOX}
        />
      </LegendSelector>
    </Box>
  </>;
};

export default MainContent;
