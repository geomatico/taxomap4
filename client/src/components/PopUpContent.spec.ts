import {expect} from 'chai';
import {getDateLabel, getPlaceLabel} from './PopUpContent';

describe('PopUpContent', () => {
  it('returns expected date labels"', async () => {
    // WHEN / THEN
    expect(getDateLabel({}, '')).to.equal(undefined);
    expect(getDateLabel({eventDate: new Date('2020-10-20Z')}, 'ca')).to.equal('20/10/2020');
    expect(getDateLabel({eventDate: new Date('2020-10-20Z')}, 'en')).to.equal('10/20/2020');
    expect(getDateLabel({eventDate: new Date('2020-10-20Z')}, 'es')).to.equal('20/10/2020');
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
