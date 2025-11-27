import {FilterDictionaries, FilterDictionaryEntry, Lang, Legend, TaxonDictionaries} from '../../commonTypes';
import {
  LEGEND_FILTER_COLOR,
  LEGEND_TAXON_COLOR,
} from '../../config';

export type Legends = {
  basisOfRecordLegend: Legend
  institutionlegend: Legend
  phylumLegend: Legend
}

const getLegends = (filterDictionaries: FilterDictionaries, taxonDictionaries: TaxonDictionaries, lang: Lang): Legends => {

  const legendForFilterEntry = ({id, name_ca, name_en, name_es, code}: FilterDictionaryEntry) => ({
    id,
    label: lang === 'en' ? name_en : lang === 'es' ? name_es : name_ca,
    color: LEGEND_FILTER_COLOR[code]
  });

  const legendForPhylumId = (id: number) =>  ({
    id,
    label: taxonDictionaries.phylum.find(taxon => taxon.id === id)?.name || (lang === 'en' ? 'Other' : lang === 'es' ? 'Otros' : 'Altres'),
    color: LEGEND_TAXON_COLOR[id]
  });

  return {
    basisOfRecordLegend: filterDictionaries.basisofrecord.length ? filterDictionaries.basisofrecord.map(legendForFilterEntry) : [],
    institutionlegend: filterDictionaries.institutioncode.length ? filterDictionaries.institutioncode.map(legendForFilterEntry) : [],
    phylumLegend: Object.keys(LEGEND_TAXON_COLOR).map(id => +id).map(legendForPhylumId)
  };
};

export default getLegends;
