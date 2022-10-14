import {expect} from 'chai';
import useTaxonPath from './useTaxonPath';

describe('useTaxonPath', () => {

  it('Calculates path for "Eukaryota" (base level)', () => {
    // GIVEN
    const selectedTaxon = {
      level: 'domain',
      id: 1
    };

    // WHEN
    const computedPath = useTaxonPath(selectedTaxon);

    // THEN
    expect(computedPath).to.deep.equal([
      {level: 'domain', id: 1, label: 'Eukaryota'}
    ]);
  });

  it('Calculates path for "Plantae" (2nd level)', () => {
    // GIVEN
    const selectedTaxon = {
      level: 'kingdom',
      id: 2
    };

    // WHEN
    const computedPath = useTaxonPath(selectedTaxon);

    // THEN
    expect(computedPath).to.deep.equal([
      {level: 'domain', id: 1, label: 'Eukaryota'},
      {level: 'kingdom', id: 2, label: 'Plantae'}
    ]);
  });

  it('Calculates the path for "Orchis laxiflora palustris" (any level)', () => {
    // GIVEN
    const selectedTaxon = {
      level: 'subspecies',
      id: 14800
    };

    // WHEN
    const computedPath = useTaxonPath(selectedTaxon);

    // THEN
    expect(computedPath).to.deep.equal([
      {level: 'domain', id: 1, label: 'Eukaryota'},
      {level: 'kingdom', id: 2, label: 'Plantae'},
      {level: 'phylum', id: 5, label: 'Tracheophyta'},
      {level: 'class', id: 7, label: 'Magnoliopsida'},
      {level: 'order', id: 39, label: 'Asparagales'},
      {level: 'family', id: 99, label: 'Orchidaceae'},
      {level: 'genus', id: 155, label: 'Orchis'},
      {level: 'species', id: 13641, label: 'Orchis laxiflora'},
      {level: 'subspecies', id: 14800, label: 'Orchis laxiflora palustris'}
    ]);
  });
});
