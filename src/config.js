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

export const DATA_PROPS = {
  // The 9 taxonomic levels
  domain: 'd',
  kingdom: 'k',
  phylum: 'p',
  class: 'c',
  order: 'o',
  family: 'f',
  genus: 'g',
  species: 's',
  subspecies: 'z',
  // Other filters
  basisofrecord: 'b',
  institutioncode: 'i',
  year: 'y'
};


export const PHYLUM_LEGEND = [
  {id: 1, color: '#FABB5C', values: [6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 18, 19, 20, 21]}, // Other
  {id: 5, color: '#58A062', values: [5]}, // Tracheophyta
  {id: 2, color: '#F07971', values: [1]}, // Chordata
  {id: 3, color: '#54BFDE', values: [2, 14]}, // Mollusca
  {id: 4, color: '#666666', values: [3, 4, 12]} // Arthropoda
];

export const BASIS_OF_RECORD_LEGEND = [
  {id: 2, color: '#58A062'}, // Non-fossil
  {id: 1, color: '#F07971'}  // Fossil
];

export const INSTITUTION_LEGEND = [
  {id: 4, color: '#58A062'}, // Institut Botànic de Barcelona
  {id: 1, color: '#F02921'}, // Institut Mediterrani d'Estudis Avançats
  {id: 3, color: '#343FCE'}, // Museu Valencià d'Història Natural
  {id: 5, color: '#5A9DDA'}, // Universitat de Barcelona
  {id: 2, color: '#FABB5C'}  // Museu Ciències Naturals Barcelona
];

export const FILTER_BY = ['institutioncode', 'basisofrecord'];

export const MIN_YEAR = 1990;
export const MAX_YEAR = 2020;

