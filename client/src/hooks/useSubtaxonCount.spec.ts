import {expect} from 'chai';
import {renderHook} from '@testing-library/react-hooks/dom';

import useSubtaxonCount from './useSubtaxonCount';
import {Filters, TaxonomicLevel} from '../commonTypes';
import phylum from '../../static/data/dictionaries/phylum.json';

describe('useSubtaxonCount', () => {

  it('Calculates subtaxons for "Mollusca"', async () => {
    // GIVEN
    const filters: Filters = {
      taxon: {
        level: TaxonomicLevel.phylum,
        id: phylum.find(({name}) => name === 'Mollusca')?.id || 0
      },
      yearRange: [1852, 2019]
    };

    // WHEN
    const {result, waitForValueToChange} = renderHook(() => useSubtaxonCount(filters));
    if (Object.keys(result.current).length === 0) {
      await waitForValueToChange(() => Object.keys(result.current).length > 0);
    }
    const subtaxonCount = result.current;

    // THEN
    expect(Object.values(subtaxonCount)).to.to.have.members([1640, 12, 27, 39, 19308, 6]); // TODO this test is coupled with `data/taxomap.arrow` and will fail when it changes!
  });
});
