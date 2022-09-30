import React, {useEffect, useState} from 'react';

import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import DeckGL from '@deck.gl/react';

import {ScatterplotLayer} from '@deck.gl/layers';
import {tableFromIPC} from 'apache-arrow';

const cssStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

const INITIAL_VIEW_STATE = {
  latitude: 41.4,
  longitude: 2.2,
  zoom: 5,
  bearing: 0,
  pitch: 0
};

export default function DeckSampleView() {
  const mapStyle = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

  const [data, setData] = useState();

  useEffect(() => {
    tableFromIPC(fetch('data/taxomap_ultralite.arrow'))
      .then(arrowTable => {
        const geometryColumn = arrowTable.getChild('geometry');
        const flatCoordinateArray = geometryColumn.getChildAt(0).data[0].values;
        //const colorAttribute = applyColor(arrowTable.getChild('p').data[0].values);
        setData(flatCoordinateArray);
      });
  }, []);

  const layers = [
    new ScatterplotLayer({
      id: 'scatter-plot',
      data: data ? {
        length: data.length / 2,
        attributes: {
          getPosition: {
            value: data,
            size: 2
          }
        }
      } : undefined,
      radiusScale: 30,
      radiusMinPixels: 0.25,
      getRadius: 1
    })
  ];

  return (
    <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={true} style={cssStyle}>
      <Map reuseMaps mapStyle={mapStyle} styleDiffing={false} mapLib={maplibregl}/>
    </DeckGL>
  );
}
