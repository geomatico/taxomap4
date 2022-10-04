export const DRAWER_WIDTH = 300;
export const SM_BREAKPOINT = 600;
export const OFFSET_TOP = 83;

export const INITIAL_VIEWPORT = {
  latitude: 41.4,
  longitude: 2.2,
  zoom: 5,
  bearing: 0,
  pitch: 0
};

export const MAPSTYLES = [
  {
    'label': 'Map',
    'thumbnail': 'https://openicgc.github.io/img/positron.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/positron.json',
    'firstTopLayer': 'place_other'
  },
  {
    'label': 'Ortofoto',
    'thumbnail': 'https://openicgc.github.io/img/orto.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/hibrid.json',
    'firstTopLayer': 'place-other'
  },
  {
    'label': 'OSM Bright',
    'thumbnail': 'https://openicgc.github.io/img/osm-bright.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/osm-bright.json',
    'firstTopLayer': 'place-other'
  },
  {
    'label': 'Temperature',
    'thumbnail': 'images/temperature.png',
    'id': 'mapstyles/temperature.json',
    'firstTopLayer': 'place-other'
  },
  {
    'label': 'Rain',
    'thumbnail': 'images/rain.png',
    'id': 'mapstyles/rain.json',
    'firstTopLayer': 'place-other'
  },
  {
    'label': 'Land cover',
    'thumbnail': 'images/landcover.png',
    'id': 'mapstyles/landcover.json',
    'firstTopLayer': 'place-other'
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[1].id;