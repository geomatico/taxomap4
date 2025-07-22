import {MapStyle, TaxonomicLevel, Viewport} from './commonTypes';

export const DRAWER_WIDTH = 300;
export const SM_BREAKPOINT = 600;
export const OFFSET_TOP = 83;

export const INITIAL_VIEWPORT: Viewport = {
  latitude: 41.4,
  longitude: 2.2,
  zoom: 5,
  bearing: 0,
  pitch: 0
};

export const MAPSTYLES: Array<MapStyle> = [
  {
    id: 'https://geoserveis.icgc.cat/contextmaps/icgc_orto_hibrida.json',
    label: 'ortophoto',
    thumbnail: 'https://visors.icgc.cat/contextmaps/imatges_estil/icgc_orto_hibrida.png'
  },
  {
    id: 'https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_gris.json',
    label: 'gray',
    thumbnail: 'https://visors.icgc.cat/contextmaps/imatges_estil/icgc_mapa_base_gris.png'
  },
  {
    id: 'https://geoserveis.icgc.cat/contextmaps/icgc_delimitacio_estandard.json',
    label: 'bright',
    thumbnail: 'https://visors.icgc.cat/contextmaps/imatges_estil/icgc_delimitacio_estandard.png'
  },
  {
    id: 'mapstyles/landcover.json',
    label: 'landCover',
    thumbnail: 'images/landcover.png'
  },
  {
    id: 'mapstyles/temperature.json',
    label: 'temperature',
    thumbnail: 'images/temperature.png'
  },
  {
    id: 'mapstyles/rain.json',
    label: 'rain',
    thumbnail: 'images/rain.png'
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[2].id;

export const ARROW_FIELDS = [
  'id', 'catalognumber', 'domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus',
  'species', 'subspecies', 'basisofrecord', 'institutioncode', 'year'
];

export const FILTER_BY = ['institutioncode', 'basisofrecord'];

export const INITIAL_TAXONOMIC_LEVEL = TaxonomicLevel.kingdom;
export const INITIAL_TAXONOMIC_NAME = 'Animalia';

export const GEOSERVER_BASE_URL = process.env.GEOSERVER_BASE_URL;

export const API_BASE_URL = process.env.API_BASE_URL as string;

export const INSTITUTION_COLOR = [
  {
    id: 'Museu Ciències Naturals Barcelona',
    color: '#58a062'
  },
  {
    id: 'Museu Valencià d\'Història Natural',
    color: '#fabb5c'
  },
  {
    id: 'Universitat de Barcelona',
    color: '#5a9dda'
  },
  {
    id: 'Institut Mediterrani d\'Estudis Avançats',
    color: '#f02921'
  },
  {
    id: 'Institut Botànic de Barcelona',
    color: '#58a062'
  },
  {
    id: 'MCNB',
    color: '#a5a4a4'
  }
];

export const STATIC_RESOURCES_HOST = process.env.STATIC_RESOURCES_HOST || '';
