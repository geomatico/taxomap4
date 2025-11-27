import {expect} from 'chai';
import {readTestFilterDictionaries, readTestTaxonDictionaries} from '../../test/testData';
import getLegends from './getLegends';

describe('getLegends', () => {
  it('get legends', async () => {
    // GIVEN
    console.log('readTestFilterDictionaries');
    const filterDictionaries = await readTestFilterDictionaries();
    console.log('readTestTaxonDictionaries');
    const taxonDictionaries = await readTestTaxonDictionaries();

    // WHEN
    const legends = getLegends(filterDictionaries, taxonDictionaries, 'ca');

    // THEN
    expect(legends.basisOfRecordLegend.map(entry => entry.id)).to.eql([1, 2]);
    expect(legends.institutionlegend.map(entry => entry.id)).to.eql([1, 2, 3, 4, 5]);
    expect(legends.phylumLegend.map(entry => entry.id)).to.eql([0, 44, 52, 54, 7707728]); // The ones in LEGEND_TAXON_COLOR
  });
});
