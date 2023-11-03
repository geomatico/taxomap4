import {expect} from 'chai';
import {getDateLabel, getPlaceLabel} from './PopUpContent';

describe('PopUpContent', () => {
  it('returns expected date labels"', async () => {
    // WHEN / THEN
    expect(getDateLabel({})).to.equal(undefined);
    expect(getDateLabel({year: 2000, day: 20})).to.equal('2000');
    expect(getDateLabel({year: 2000, month: 2})).to.equal('2000-02');
    expect(getDateLabel({year: 2000, month: 2, day: 7})).to.equal('2000-02-07');
  });

  it('returns expected place labels"', async () => {
    // WHEN / THEN
    expect(getPlaceLabel({})).to.equal(undefined);
    expect(getPlaceLabel({municipality: 'Valencia'})).to.equal('Valencia');
    expect(getPlaceLabel({county: 'Valencia'})).to.equal('Valencia');
    expect(getPlaceLabel({stateProvince: 'Valencia'})).to.equal('Valencia');
    expect(getPlaceLabel({municipality: 'V1', county: 'V2'})).to.equal('V1 (V2)');
    expect(getPlaceLabel({municipality: 'V1', stateProvince: 'V2'})).to.equal('V1 (V2)');
    expect(getPlaceLabel({county: 'V1', stateProvince: 'V2'})).to.equal('V1 (V2)');
    expect(getPlaceLabel({municipality: 'V1', county: 'V2', stateProvince: 'V3'})).to.equal('V1, V2 (V3)');
  });
});
