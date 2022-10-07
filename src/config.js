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
    'label': 'ortophoto',
    'thumbnail': 'https://openicgc.github.io/img/orto.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/hibrid.json',
  },
  {
    'label': 'gray',
    'thumbnail': 'https://openicgc.github.io/img/positron.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/positron.json',
  },
  {
    'label': 'bright',
    'thumbnail': 'https://openicgc.github.io/img/osm-bright.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/osm-bright.json',
  },
  {
    'label': 'landCover',
    'thumbnail': 'images/landcover.png',
    'id': 'mapstyles/landcover.json',
  },
  {
    'label': 'temperature',
    'thumbnail': 'images/temperature.png',
    'id': 'mapstyles/temperature.json',
  },
  {
    'label': 'rain',
    'thumbnail': 'images/rain.png',
    'id': 'mapstyles/rain.json',
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[0].id;

export const PHYLUM_LEGEND = [
  {id: 1, color: '#FABB5C', label: 'Other', values: [6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 18, 19, 20, 21]},
  {id: 5, color: '#58A062', label: 'Tracheophyta', values: [5]},
  {id: 2, color: '#F07971', label: 'Chordata', values: [1]},
  {id: 3, color: '#54BFDE', label: 'Mollusca', values: [2, 14]},
  {id: 4, color: '#666666', label: 'Arthropoda', values: [3, 4, 12]}
];

export const BASIS_OF_RECORD_LEGEND = [
  {id: 2, color: '#58A062', label: 'Non-fossil'},
  {id: 1, color: '#F07971', label: 'Fossil'}
];

export const INSTITUTION_LEGEND = [
  {id: 4, color: '#58A062', label: 'Institut Botànic de Barcelona'},
  {id: 1, color: '#F02921', label: 'Institut Mediterrani d\'Estudis Avançats'},
  {id: 3, color: '#343FCE', label: 'Museu Valencià d\'Història Natural'},
  {id: 5, color: '#5A9DDA', label: 'Universitat de Barcelona'},
  {id: 2, color: '#FABB5C', label: 'Museu Ciències Naturals Barcelona'}
];

export const FILTER_BY = ['institutioncode', 'basisofrecord'];