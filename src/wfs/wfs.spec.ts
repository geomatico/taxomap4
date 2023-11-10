import {expect} from 'chai';
import {getPropertyName, getWfsDownloadUrl} from './wfs';
import {Filters, TaxonomicLevel} from '../commonTypes';
import {GEOSERVER_BASE_URL} from '../config';

describe('wfs', () => {
  it('Returns WFS without optional filters"', async () => {
    // GIVEN
    const format = 'application/json';
    const filters = {
      taxon: {
        level: TaxonomicLevel.family,
        id: 1
      }
    };

    // WHEN
    const urlString = getWfsDownloadUrl(format, filters);

    // THEN
    const params = validateUrlAndGetParams(format, urlString);
    expect(params.get('cql_filter')).to.equal('family_id = 1');
  });

  it('Returns WFS with all optional filters"', async () => {
    // GIVEN
    const format = 'application/json';
    const filters: Filters = {
      taxon: {
        level: TaxonomicLevel.family,
        id: 1
      },
      yearRange: [1920, 2010],
      institutionId: 2,
      basisOfRecordId: 3,
      subtaxonVisibility: {
        subtaxonLevel: TaxonomicLevel.genus,
        isVisible: {
          1: true,
          2: false,
          3: true
        }
      },
      bbox: [0.5, 42.7, 0.6, 42.8],
    };

    // WHEN
    const urlString = getWfsDownloadUrl(format, filters);

    // THEN
    const params = validateUrlAndGetParams(format, urlString);
    expect(params.get('cql_filter')).to.equal('family_id = 1 ' +
      'AND institutioncode_id = 2 AND basisofrecord_id = 3 AND genus IN (1,3) ' +
      'AND year >= 1920 AND year <= 2010 ' +
      'AND BBOX(geom,0.5,42.7,0.6,42.8)');
  });

  it('Returns WFS with all subtaxa visible"', async () => {
    // GIVEN
    const format = 'application/json';
    const filters = {
      taxon: {
        level: TaxonomicLevel.family,
        id: 1
      },
      subtaxonVisibility: {
        subtaxonLevel: TaxonomicLevel.genus,
        isVisible: {
          1: true,
          2: true,
          3: true
        }
      }
    };

    // WHEN
    const urlString = getWfsDownloadUrl(format, filters);

    // THEN
    const params = validateUrlAndGetParams(format, urlString);
    expect(params.get('cql_filter')
    ).to.equal('family_id = 1');
  });

  it('Returns WFS with all subtaxa not visible"', async () => {
    // GIVEN
    const format = 'application/json';
    const filters = {
      taxon: {
        level: TaxonomicLevel.family,
        id: 1
      },
      subtaxonVisibility: {
        subtaxonLevel: TaxonomicLevel.genus,
        isVisible: {
          1: false,
          2: false,
          3: false
        }
      }
    };

    // WHEN
    const urlString = getWfsDownloadUrl(format, filters);

    // THEN
    const params = validateUrlAndGetParams(format, urlString);
    expect(params.get('cql_filter')
    ).to.equal('family_id = 1 AND 1=0');
  });

  it('Returns WFS property names for taxonomy levels', async () => {
    // WHEN / THEN
    // ensure TaxonomicLevel type is (in theory) decoupled from WFS property names
    expect(getPropertyName(TaxonomicLevel.domain)).to.equal('domain_id');
    expect(getPropertyName(TaxonomicLevel.kingdom)).to.equal('kingdom_id');
    expect(getPropertyName(TaxonomicLevel.phylum)).to.equal('phylum_id');
    expect(getPropertyName(TaxonomicLevel.class)).to.equal('class_id');
    expect(getPropertyName(TaxonomicLevel.order)).to.equal('order_id');
    expect(getPropertyName(TaxonomicLevel.family)).to.equal('family_id');
    expect(getPropertyName(TaxonomicLevel.genus)).to.equal('genus_id');
    expect(getPropertyName(TaxonomicLevel.species)).to.equal('species_id');
    expect(getPropertyName(TaxonomicLevel.subspecies)).to.equal('subspecies_id');
  });

  const validateUrlAndGetParams = (expectedFormat: string, urlString: string): URLSearchParams => {
    const url = new URL(urlString);
    expect(urlString.startsWith(GEOSERVER_BASE_URL + '/wfs')).to.be.true;
    const params = new URLSearchParams(url.search);
    expect(params.get('version')).to.equal('1.0.0');
    expect(params.get('request')).to.equal('GetFeature');
    expect(params.get('typeName')).to.equal('taxomap:taxomap');
    expect(params.get('outputFormat')).to.equal(expectedFormat);
    expect(params.get('content-disposition')).to.equal('attachment');
    expect(params.size).to.equal(6); // cql_filter to be validated separately for each test
    return params;
  };
});
