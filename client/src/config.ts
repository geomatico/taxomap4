import {BasisOfRecord, HEXColor, MapStyle, TaxonomicLevel, Viewport} from './commonTypes';

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
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[1].id;

export const ARROW_FIELDS = [
  'id', 'catalognumber', 'basisofrecord', 'institutioncode', 'year',
  'domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'subspecies'
];

export const FILTER_BY = ['basisofrecord', 'institutioncode'];

export const INITIAL_TAXONOMIC_LEVEL = TaxonomicLevel.kingdom;
export const INITIAL_TAXONOMIC_ID = 1; // Animalia

export const GEOSERVER_BASE_URL = process.env.GEOSERVER_BASE_URL;

export const API_BASE_URL = process.env.API_BASE_URL as string;

export const LEGEND_FILTER_COLOR: Record<string | BasisOfRecord, HEXColor> = {
  MCNB: '#FABB5C',
  MVHN: '#343FCE',
  UB: '#5A9DDA',
  IMEDEA: '#F02921',
  IBB: '#58A062',
  //---
  FOSSIL: '#F07971',
  NON_FOSSIL: '#58A062'
};

export const LEGEND_TAXON_COLOR: Record<number, HEXColor> = {
  7707728: '#58A062', // Tracheophyta
  54: '#F07971', // Arthropoda
  44: '#54BFDE', // Chordata
  52: '#666666', // Mollusca
  0: '#FABB5C' // ...other
};

export const STATIC_RESOURCES_HOST = process.env.STATIC_RESOURCES_HOST || '';
