import {expect} from 'chai';
import {renderHook} from '@testing-library/react-hooks/dom';

import useSubtaxonCount from './useSubtaxonCount';
import {TaxonomicLevel, Range} from '../commonTypes';

describe('useSubtaxonCount', () => {

  it('Calculates subtaxons for "Mollusca"', async () => {
    // GIVEN
    const params = {
      selectedTaxon: {
        level: TaxonomicLevel.phylum,
        id: 2 // mollusca
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
      0: 6, // null
      2: 19308, // Gastropoda
      3: 1640, // Bivalvia
      14: 27, // Polyplacophora
      22: 12, // Cephalopoda
      38: 39 // Scaphopoda
    });
  });
});
