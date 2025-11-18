import {expect} from 'chai';
import {getPropertyName, getWfsDownloadUrl, getWfsFeatureProperties, WFS_PROPERTY} from './wfs';
import {Filters, TaxonomicLevel} from '../commonTypes';
import {GEOSERVER_BASE_URL} from '../config';
import fetchMock, {MockResponse} from 'fetch-mock';

describe('wfs', () => {
  beforeEach(() => fetchMock.restore());
  afterEach(() => fetchMock.restore());

  it('getWfsDownloadUrl returns URL without optional filters"', async () => {
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

  it('getWfsDownloadUrl returns URL with all optional filters"', async () => {
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
      'AND institution_id = 2 AND basis_of_record_id = 3 AND genus IN (1,3) ' +
      'AND eventDate DURING 1920-01-01T00:00:00Z/2010-12-31T23:59:59Z ' +
      'AND BBOX(geometry,0.5,42.7,0.6,42.8)');
  });

  it('getWfsDownloadUrl returns URL with all subtaxa visible"', async () => {
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

  it('getWfsDownloadUrl returns URL with all subtaxa not visible"', async () => {
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

  it('getPropertyName returns names for taxonomy levels', async () => {
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

  it('getWfsFeatureProperties returns undefined if ID undefined', async () => {
    // WHEN
    const properties = await getWfsFeatureProperties(undefined, [WFS_PROPERTY.county]);
    // THEN
    expect(properties).to.equal(undefined);
  });

  it('getWfsFeatureProperties returns undefined if error response', async () => {
    // GIVEN
    const featureId = 42;
    const propertyNames = [WFS_PROPERTY.county];
    mockGetFeatureProperties(featureId, propertyNames, 500);

    // WHEN
    const properties = await getWfsFeatureProperties(featureId, propertyNames);

    // THEN
    expect(properties).to.equal(undefined);
  });

  it('getWfsFeatureProperties returns undefined if unrecognized response', async () => {
    // GIVEN
    const featureId = 42;
    const propertyNames = [WFS_PROPERTY.county];
    mockGetFeatureProperties(featureId, propertyNames, {someWeirdProperty: 42});

    // WHEN
    const properties = await getWfsFeatureProperties(featureId, propertyNames);

    // THEN
    expect(properties).to.equal(undefined);
  });

  it('getWfsFeatureProperties returns requested properties', async () => {
    // GIVEN
    const featureId = 42;
    const propertyNames = [
      WFS_PROPERTY.eventDate,
      WFS_PROPERTY.municipality, WFS_PROPERTY.county, WFS_PROPERTY.stateProvince,
      WFS_PROPERTY.scientificName
    ];
    const response = {
      features: [{
        properties: {
          eventDate: '2023-11-01Z',
          county: 'Burjassot',
          stateProvince: 'Valencia',
          scientificName: 'Ornithorhynchus anatinus'
        }
      }]
    };
    mockGetFeatureProperties(featureId, propertyNames, response);

    // WHEN
    const properties = await getWfsFeatureProperties(featureId, propertyNames);

    // THEN
    expect(properties?.eventDate).to.eql(new Date(response.features[0].properties.eventDate));
    expect(properties?.municipality).to.equal(undefined);
    expect(properties?.county).to.equal(response.features[0].properties.county);
    expect(properties?.stateProvince).to.equal(response.features[0].properties.stateProvince);
    expect(properties?.scientificName).to.equal(response.features[0].properties.scientificName);
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
    expect(Array.from(params.entries()).length).to.equal(7); // cql_filter to be validated separately for each test
    return params;
  };

  const mockGetFeatureProperties = (featureId: number, propertyNames: WFS_PROPERTY[], response: MockResponse): void => {
    fetchMock.get(`${GEOSERVER_BASE_URL}/wfs`, response, {
      query: {
        service: 'wfs',
        version: '2.0.0',
        request: 'GetFeature',
        typeName: 'taxomap:taxomap',
        outputFormat: 'application/json',
        featureID: featureId,
        propertyName: propertyNames.join(',')
      }
    });
  };
});
