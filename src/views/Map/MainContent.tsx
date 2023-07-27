import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Map, MapRef} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react/typed';
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
import {
  BBOX,
  ChildrenVisibility,
  Dictionaries,
  RGBAArrayColor,
  SymbolizeBy,
  TaxomapData,
  Taxon,
  Viewport,
  YearRange
} from '../../commonTypes';

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

type MainContentProps = {
  institutionFilter?: number,
  basisOfRecordFilter?: number,
  yearFilter?: YearRange,
  onYearFilterChange: (range: YearRange) => void,
  taxonFilter: Taxon,
  BBOX?: BBOX,
  onBBOXChanged: (bbox: BBOX) => void,
  childrenVisibility?: ChildrenVisibility
};

const MainContent: FC<MainContentProps> = ({
  institutionFilter,
  basisOfRecordFilter,
  yearFilter,
  onYearFilterChange,
  taxonFilter,
  BBOX,
  onBBOXChanged
}) => {
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState<string>(INITIAL_MAPSTYLE_URL);
  const [symbolizeBy, setSymbolizeBy] = useState<SymbolizeBy>(SymbolizeBy.institutioncode);

  const {t} = useTranslation();
  const dictionaries: Dictionaries = useDictionaries();
  const mapRef = useRef<MapRef>(null);
  const applyColor = useApplyColor(symbolizeBy);
  const data: TaxomapData | undefined = useArrowData();

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

  const handleMapResize = () => window.setTimeout(() => mapRef?.current?.resize(), 0);

  const getTooltip = (info: {
    index: number;
    picked: boolean;
  }) => {
    if (!info || !info.picked || !data) return null;

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
      ?.getElementById('deckgl-wrapper')
      ?.addEventListener('contextmenu', evt => evt.preventDefault());
  }, []);

  const years = data && data.year.filter(y => y !== 0);
  const fullYearRange: YearRange | undefined = useMemo(() => {
    return data && years && [years.reduce((n, m) => Math.min(n, m), Number.POSITIVE_INFINITY), years.reduce((n, m) => Math.max(n, m), -Number.POSITIVE_INFINITY)];
  }, [data]);

  useEffect(() => {
    if (fullYearRange) onYearFilterChange(fullYearRange);
  }, [fullYearRange]);

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
        taxonFilter?.level === undefined ? 1 : (data as TaxomapData)[taxonFilter.level][index]
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
      onViewStateChange={({viewState}) => setViewport(viewState as Viewport)}
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
          BBOX={BBOX}
        />
      </LegendSelector>
    </Box>
  </>;
};

export default MainContent;
