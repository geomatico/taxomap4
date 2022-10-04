import React, {useState} from 'react';

import Map from '@geomatico/geocomponents/Map';
import BaseMapPicker from '@geomatico/geocomponents/BaseMapPicker';

import {INITIAL_MAPSTYLE_URL, INITIAL_VIEWPORT, MAPSTYLES} from '../../config';

const MainContent = () => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);

  return <>
    <Map
      mapStyle={mapStyle}
      viewport={viewport}
      onViewportChange={setViewport}
    />
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
