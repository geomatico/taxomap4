import fetchMock from 'fetch-mock';
import {expect} from 'chai';
import {Filters, SubtaxonCount, TaxonomicLevel} from '../../commonTypes';
import phylum from '../../test/resources/dictionaries/phylum.json';
import getSubtaxonCount from './getSubtaxonCount';
import {readTestTaxonDictionaries, readTestTaxomapData} from '../../test/testData';

describe('getSubtaxonCount', () => {
  beforeEach(() => fetchMock.restore());
  afterEach(() => fetchMock.restore());

  it('Calculates subtaxons for "Mollusca"', async () => {
    // GIVEN
    const data = await readTestTaxomapData();
    const dictionaries = await readTestTaxonDictionaries();
    const filters: Filters = {
      taxon: {
        level: TaxonomicLevel.phylum,
        id: phylum.find(({name}) => name === 'Mollusca')?.id || 0
      },
      yearRange: [1852, 2019]
    };

    // WHEN
    const subtaxonCount = getSubtaxonCount(data, dictionaries, filters) as SubtaxonCount;

    // THEN
    expect(Object.values(subtaxonCount)).to.have.members([29, 12, 1596, 19057, 35, 5]);
  });
});
