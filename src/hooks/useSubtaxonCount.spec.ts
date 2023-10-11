import {expect} from 'chai';
import {renderHook} from '@testing-library/react-hooks/dom';

import useSubtaxonCount from './useSubtaxonCount';
import {TaxonomicLevel, Range} from '../commonTypes';
import phylum from '../../static/data/dictionaries/phylum.json';

describe('useSubtaxonCount', () => {

  it('Calculates subtaxons for "Mollusca"', async () => {
    // GIVEN
    const params = {
      selectedTaxon: {
        level: TaxonomicLevel.phylum,
        id: phylum.find(({name}) => name === 'Mollusca')?.id || 0
      },
      institutionFilter: undefined,
      basisOfRecordFilter: undefined,
      yearFilter: [1852, 2019] as Range,
      BBOX: undefined
    };

    // WHEN
    const {result, waitForValueToChange} = renderHook(() => useSubtaxonCount(params));
    if (Object.keys(result.current).length === 0) {
      await waitForValueToChange(() => Object.keys(result.current).length > 0);
    }
    const subtaxonCount = result.current;

    // THEN
    expect(subtaxonCount).to.deep.equal({
      '26': 19314,
      '48': 1640,
      '42': 39,
      '53': 27,
      '34': 12,
      '79': 6
    });
  });
});
