import {expect} from 'chai';
import {getWfsDownloadUrl} from './wfs';
import {Taxon, TaxonomicLevel} from '../commonTypes';
import {GEOSERVER_BASE_URL} from '../config';

describe('wfs', () => {
  it('Returns WFS without filters"', async () => {
    // GIVEN
    const format = 'shp';
    const taxon: Taxon = {
      level: TaxonomicLevel.family,
      id: 1
    };

    // WHEN
    const urlString = getWfsDownloadUrl(format, undefined, undefined, undefined, taxon, undefined, undefined);

    // THEN
    const url = new URL(urlString);
    expect(urlString.startsWith(GEOSERVER_BASE_URL + '/wfs')).to.be.true;
    const params = new URLSearchParams(url.search);
    expect(params.get('version')).to.equal('1.0.0');
    expect(params.get('request')).to.equal('GetFeature');
    expect(params.get('typeName')).to.equal('taxomap:taxomap');
    expect(params.get('outputFormat')).to.equal(format);
    expect(params.size).to.equal(4);
  });
});
