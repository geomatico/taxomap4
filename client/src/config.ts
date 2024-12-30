import {Legend, MapStyle, Taxon, TaxonomicLevel, Viewport} from './commonTypes';

import basisofrecord from '../static/data/dictionaries/basisofrecord.json';
import institutioncode from '../static/data/dictionaries/institutioncode.json';
import kingdom from '../static/data/dictionaries/kingdom.json';
import phylum from '../static/data/dictionaries/phylum.json';

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

export const ARROW_FIELDS = ['id', 'catalognumber', 'domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'subspecies', 'basisofrecord', 'institutioncode', 'year'];

const idByName = (dictionary: Array<{
  id: number,
  name: string
}>) => (name: string) => dictionary.find(r => r.name === name)?.id ?? 0;

export const INITIAL_TAXON: Taxon = {
  level: TaxonomicLevel.kingdom,
  id: idByName(kingdom)('Animalia')
};


export const PHYLUM_LEGEND: Legend = [
  {
    id: idByName(phylum)('Tracheophyta'),
    labelKey: 'tracheophyta',
    color: '#58A062'
  },
  {
    id: idByName(phylum)('Chordata'),
    labelKey: 'chordata',
    color: '#F07971'
  },
  {
    id: idByName(phylum)('Mollusca'),
    labelKey: 'mollusca',
    color: '#54BFDE'
  },
  {
    id: idByName(phylum)('Arthropoda'),
    labelKey: 'arthropoda',
    color: '#666666'
  },
  {
    id: 0,
    labelKey: 'other',
    color: '#FABB5C'
  }
];

export const BASIS_OF_RECORD_LEGEND: Legend = [
  {
    id: idByName(basisofrecord)('Non-fossil/No fòssil/No fósil'),
    labelKey: 'nonFossil',
    color: '#58A062'
  },
  {
    id: idByName(basisofrecord)('Fossil/Fòssil/Fósil'),
    labelKey: 'fossil',
    color: '#F07971'
  }
];

export const INSTITUTION_LEGEND: Legend = [
  {
    id: idByName(institutioncode)('Institut Botànic de Barcelona'),
    labelKey: 'botanic',
    color: '#58A062'
  },
  {
    id: idByName(institutioncode)('Institut Mediterrani d\'Estudis Avançats'),
    labelKey: 'imea',
    color: '#F02921'
  },
  {
    id: idByName(institutioncode)('Museu Valencià d\'Història Natural'),
    labelKey: 'valencia',
    color: '#343FCE'
  },
  {
    id: idByName(institutioncode)('Universitat de Barcelona'),
    labelKey: 'ub',
    color: '#5A9DDA'
  },
  {
    id: idByName(institutioncode)('Museu Ciències Naturals Barcelona'),
    labelKey: 'mcnb',
    color: '#FABB5C'
  }
];

export const MUSEU_ID = idByName(institutioncode)('Museu Ciències Naturals Barcelona');

export const FILTER_BY = ['institutioncode', 'basisofrecord'];

export const GEOSERVER_BASE_URL = process.env.GEOSERVER_BASE_URL;

export const API_BASE_URL = process.env.API_BASE_URL as string;

export const INSTITUTION_COLOR = [
  {
    id: 'MVHN',
    color: '#343FCE'
  }
];
