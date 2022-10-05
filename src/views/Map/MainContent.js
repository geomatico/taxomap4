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
import {useTranslation} from 'react-i18next';

const cssStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

const MainContent = ({symbolizeBy, yearFilter, institutionFilter, basisOfRecordFilter, taxonFilter}) => {
  const {t} = useTranslation();
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [arrowTable, setArrowTable] = useState();

  const applyColors = useApplyColors(symbolizeBy);

  console.log('Applied Filters:', JSON.stringify({yearFilter, institutionFilter, basisOfRecordFilter, taxonFilter})); // TODO MCNB-62 Aplicar filtros a los datos del mapa

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

  // TODO esto lo movemos a algun tipo de utils?
  const translateBaseMapLabels = (mapStyles) => {
    return mapStyles.map(el => ({...el, label: t('mapStyles.'+el.label) }));
  };

  return <>
    <DeckGL layers={deckLayers} initialViewState={INITIAL_VIEWPORT} controller style={cssStyle} onResize={handleMapResize}>
      <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} mapLib={maplibregl} ref={mapRef}/>
    </DeckGL>
    <BaseMapPicker
      position='top-right'
      direction='down'
      styles={translateBaseMapLabels(MAPSTYLES)}
      selectedStyleId={mapStyle}
      onStyleChange={setMapStyle}
    />
  </>;
};

MainContent.propTypes = {
  symbolizeBy: PropTypes.oneOf(['phylum', 'basisofrecord', 'institutioncode']).isRequired,
  yearFilter: PropTypes.arrayOf(PropTypes.number),
  institutionFilter: PropTypes.number,
  basisOfRecordFilter: PropTypes.number,
  taxonFilter: PropTypes.shape({
    level: PropTypes.oneOf(['domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'subspecies']).isRequired,
    id: PropTypes.number.isRequired
  })
};

export default MainContent;
