import {expect} from 'chai';
import cut from './wfs';
import {Taxon, TaxonomicLevel, Range} from '../commonTypes';
import {GEOSERVER_BASE_URL} from '../config';

describe('wfs', () => {
  it('Returns WFS without optional filters"', async () => {
    // GIVEN
    const format = 'application/json';
    const taxon: Taxon = {
      level: TaxonomicLevel.family,
      id: 1
    };

    // WHEN
    const urlString = cut.getWfsDownloadUrl(format, undefined, undefined, undefined, taxon, undefined, undefined);

    // THEN
    const params = validateUrlAndGetParams(format, urlString);
    expect(params.get('cql_filter')).to.equal('family_id = 1');
  });

  it('Returns WFS with all optional filters"', async () => {
    // GIVEN
    const format = 'application/json';
    const taxon: Taxon = {
      level: TaxonomicLevel.family,
      id: 1
    };
    const yearRange: Range = [1920, 2010];
    const institutionId = 2;
    const basisOfRecordId = 3;
    const subtaxonVisibility = {
      subtaxonLevel: TaxonomicLevel.genus,
      isVisible: {
        1: true,
        2: false,
        3: true
      }
    };

    // WHEN
    const urlString = cut.getWfsDownloadUrl(format, yearRange, institutionId, basisOfRecordId, taxon, subtaxonVisibility, undefined);

    // THEN
    const params = validateUrlAndGetParams(format, urlString);
    expect(params.get('cql_filter')).to.equal('family_id = 1 AND institutioncode_id = 2 AND basisofrecord_id = 3 AND genus IN (1,3) AND year >= 1920 AND year <= 2010');
  });

  it('Returns WFS with all subtaxa not visible"', async () => {
    // GIVEN
    const format = 'application/json';
    const taxon: Taxon = {
      level: TaxonomicLevel.family,
      id: 1
    };
    const subtaxonVisibility = {
      subtaxonLevel: TaxonomicLevel.genus,
      isVisible: {
        1: false,
        2: false,
        3: false
      }
    };

    // WHEN
    const urlString = cut.getWfsDownloadUrl(format, undefined, undefined, undefined, taxon, subtaxonVisibility, undefined);

    // THEN
    const params = validateUrlAndGetParams(format, urlString);
    expect(params.get('cql_filter')).to.equal('family_id = 1 AND 1=0');
  });

  it('Returns WFS property names for taxonomy levels', async () => {
    // WHEN / THEN
    // ensure TaxonomicLevel type is (in theory) decoupled from WFS property names
    expect(cut.getPropertyName(TaxonomicLevel.domain)).to.equal('domain_id');
    expect(cut.getPropertyName(TaxonomicLevel.kingdom)).to.equal('kingdom_id');
    expect(cut.getPropertyName(TaxonomicLevel.phylum)).to.equal('phylum_id');
    expect(cut.getPropertyName(TaxonomicLevel.class)).to.equal('class_id');
    expect(cut.getPropertyName(TaxonomicLevel.order)).to.equal('order_id');
    expect(cut.getPropertyName(TaxonomicLevel.family)).to.equal('family_id');
    expect(cut.getPropertyName(TaxonomicLevel.genus)).to.equal('genus_id');
    expect(cut.getPropertyName(TaxonomicLevel.species)).to.equal('species_id');
    expect(cut.getPropertyName(TaxonomicLevel.subspecies)).to.equal('subspecies_id');
  });

  function validateUrlAndGetParams(expectedFormat: string, urlString: string): URLSearchParams {
    const url = new URL(urlString);
    expect(urlString.startsWith(GEOSERVER_BASE_URL + '/wfs')).to.be.true;
    const params = new URLSearchParams(url.search);
    expect(params.get('version')).to.equal('1.0.0');
    expect(params.get('request')).to.equal('GetFeature');
    expect(params.get('typeName')).to.equal('taxomap:taxomap');
    expect(params.get('outputFormat')).to.equal(expectedFormat);
    return params;
  }
});
