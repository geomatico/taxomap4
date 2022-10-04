import React, {useEffect, useMemo, useRef, useState} from 'react';

import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import BaseMapPicker from '@geomatico/geocomponents/BaseMapPicker';

import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, PHYLUM_LEGEND, MAPSTYLES} from '../../config';

import DeckGL from '@deck.gl/react';

import {tableFromIPC} from 'apache-arrow';
import {ScatterplotLayer} from '@deck.gl/layers';

const cssStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

const applyColor = (values) => {

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [0, 0, 0];
  }

  const palette = PHYLUM_LEGEND.reduce((acc, {color, values}) => {
    values.map(value => acc[value] = color);
    return acc;
  }, []).map(hexToRgb);
  console.log(palette);

  const outputArray = new Float32Array(values.length * 3);

  for (let i = 0; i < values.length; ++i) {
    const value = values[i];
    const color = palette[value] || [0, 0, 0];
    outputArray[i * 3] = color[0];
    outputArray[i * 3 + 1] = color[1];
    outputArray[i * 3 + 2] = color[2];
  }

  return outputArray;
};

const MainContent = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [data, setData] = useState();

  const mapRef = useRef(null);
  const resizeBasemap = () => window.setTimeout(() => mapRef?.current?.resize(), 0);

  useEffect(() => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', evt => evt.preventDefault());
  }, []);

  useEffect(() => {
    tableFromIPC(fetch('data/taxomap_ultralite.arrow'))
      .then(arrowTable => {
        const geometryColumn = arrowTable.getChild('geometry');
        const flatCoordinateArray = geometryColumn.getChildAt(0).data[0].values;
        const colorAttribute = applyColor(arrowTable.getChild('p').data[0].values);
        setData({
          length: arrowTable.numRows,
          attributes: {
            getPosition: {
              value: flatCoordinateArray,
              size: 2
            },
            getFillColor:  {
              value: colorAttribute,
              size: 3
            }
          }
        });
      });
  }, []);

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
    <DeckGL layers={deckLayers} initialViewState={INITIAL_VIEWPORT} controller style={cssStyle} onResize={resizeBasemap}>
      <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} mapLib={maplibregl} ref={mapRef}/>
    </DeckGL>
    <BaseMapPicker
      position='top-right'
      direction='down'
      styles={MAPSTYLES}
      selectedStyleId={mapStyle}
      onStyleChange={setMapStyle}
    />
  </>;
};

export default MainContent;
