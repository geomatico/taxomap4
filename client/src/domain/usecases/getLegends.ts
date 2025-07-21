import {Dictionaries, Legend} from '../../commonTypes';
import {getIdByName} from './getDictionaries';

export type Legends = {
  basisOfRecordLegend: Legend
  institutionlegend: Legend
  phylumLegend: Legend
}

const getLegends = (dictionaries: Dictionaries): Legends => {
  return {
    basisOfRecordLegend: dictionaries.basisofrecord.length ? [{
      id: getIdByName(dictionaries.basisofrecord, 'Non-fossil/No fòssil/No fósil'),
      labelKey: 'basisofrecordLegend.nonFossil',
      color: '#58A062'
    }, {
      id: getIdByName(dictionaries.basisofrecord, 'Fossil/Fòssil/Fósil'),
      labelKey: 'basisofrecordLegend.fossil',
      color: '#F07971'
    }]: [],
    institutionlegend:  dictionaries.institutioncode.length ? [{
      id: getIdByName(dictionaries.institutioncode, 'Institut Botànic de Barcelona'),
      labelKey: 'institutionLegend.botanic',
      color: '#58A062'
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Institut Mediterrani d\'Estudis Avançats'),
      labelKey: 'institutionLegend.imea',
      color: '#F02921'
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Museu Valencià d\'Història Natural'),
      labelKey: 'institutionLegend.valencia',
      color: '#343FCE'
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Universitat de Barcelona'),
      labelKey: 'institutionLegend.ub',
      color: '#5A9DDA'
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Museu Ciències Naturals Barcelona'),
      labelKey: 'institutionLegend.mcnb',
      color: '#FABB5C'
    }]: [],
    phylumLegend: dictionaries.phylum.length ? [{
      id: getIdByName(dictionaries.phylum, 'Tracheophyta'),
      labelKey: 'phylumLegend.tracheophyta',
      color: '#58A062'
    }, {
      id: getIdByName(dictionaries.phylum, 'Chordata'),
      labelKey: 'phylumLegend.chordata',
      color: '#F07971'
    }, {
      id: getIdByName(dictionaries.phylum, 'Mollusca'),
      labelKey: 'phylumLegend.mollusca',
      color: '#54BFDE'
    }, {
      id: getIdByName(dictionaries.phylum, 'Arthropoda'),
      labelKey: 'phylumLegend.arthropoda',
      color: '#666666'
    }, {
      id: 0,
      labelKey: 'phylumLegend.other',
      color: '#FABB5C'
    }] : []
  };
};

export default getLegends;
