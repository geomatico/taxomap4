import {expect} from 'chai';
import {readTestDictionaries} from '../../test/testData';
import getLegends from './getLegends';

describe('getLegends', () => {
  it('get legends', async () => {
    // GIVEN
    const dictionaries = await readTestDictionaries();

    // WHEN
    const legends = getLegends(dictionaries);

    // THEN
    expect(legends.basisOfRecordLegend.map(entry => entry.id)).to.eql([2, 1]);
    expect(legends.institutionlegend.map(entry => entry.id)).to.eql([5, 1, 3, 4, 2]);
    expect(legends.phylumLegend.map(entry => entry.id)).to.eql([12, 3, 15, 21, 0]);
  });
});
