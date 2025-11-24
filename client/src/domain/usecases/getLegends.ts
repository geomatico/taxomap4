import {Dictionaries, Legend} from '../../commonTypes';
import {getIdByName} from './getDictionaries';
import {BASISOFRECORD_COLOR, INSTITUTION_COLOR, PHYLUM_COLOR} from '../../config';

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
      color: BASISOFRECORD_COLOR.NON_FOSSIL
    }, {
      id: getIdByName(dictionaries.basisofrecord, 'Fossil/Fòssil/Fósil'),
      labelKey: 'basisofrecordLegend.fossil',
      color: BASISOFRECORD_COLOR.FOSSIL
    }]: [],
    institutionlegend:  dictionaries.institutioncode.length ? [{
      id: getIdByName(dictionaries.institutioncode, 'Institut Botànic de Barcelona'),
      labelKey: 'institutionLegend.botanic',
      color: INSTITUTION_COLOR.IBB
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Institut Mediterrani d\'Estudis Avançats'),
      labelKey: 'institutionLegend.imea',
      color: INSTITUTION_COLOR.IMEDEA
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Museu Valencià d\'Història Natural'),
      labelKey: 'institutionLegend.valencia',
      color: INSTITUTION_COLOR.MVHN
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Universitat de Barcelona'),
      labelKey: 'institutionLegend.ub',
      color: INSTITUTION_COLOR.UB
    }, {
      id: getIdByName(dictionaries.institutioncode, 'Museu Ciències Naturals Barcelona'),
      labelKey: 'institutionLegend.mcnb',
      color: INSTITUTION_COLOR.MCNB
    }]: [],
    phylumLegend: dictionaries.phylum.length ? [{
      id: getIdByName(dictionaries.phylum, 'Tracheophyta'),
      labelKey: 'phylumLegend.tracheophyta',
      color: PHYLUM_COLOR.TRACHEOPHYTA
    }, {
      id: getIdByName(dictionaries.phylum, 'Chordata'),
      labelKey: 'phylumLegend.chordata',
      color: PHYLUM_COLOR.CHORDATA
    }, {
      id: getIdByName(dictionaries.phylum, 'Mollusca'),
      labelKey: 'phylumLegend.mollusca',
      color: PHYLUM_COLOR.MOLLUSCA
    }, {
      id: getIdByName(dictionaries.phylum, 'Arthropoda'),
      labelKey: 'phylumLegend.arthropoda',
      color: PHYLUM_COLOR.ARTHROPODA
    }, {
      id: 0,
      labelKey: 'phylumLegend.other',
      color: PHYLUM_COLOR.OTHER
    }] : []
  };
};

export default getLegends;
