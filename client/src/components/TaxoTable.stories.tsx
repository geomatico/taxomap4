import React, {ComponentProps} from 'react';
import {Meta, Story} from '@storybook/react';

import TaxoTable from './TaxoTable';

export default {
  title: 'TaxoTable',
  component: TaxoTable
} as Meta;

type TaxoTableProps = ComponentProps<typeof TaxoTable>;

const Template: Story<TaxoTableProps> = args => <TaxoTable {...args}/>;

export const Default = Template.bind({});
Default.args = {
  data: [
    {
      id: 146934,
      institutionCode: 'IMEDEA',
      collectionCode: 'IMEDEA-INSECTA',
      catalogNumber: 'IMEDEA-INSECTA 10041',
      basisOfRecord: 'NON_FOSSIL',
      taxonID: 4454670,
      decimalLatitude: 38.45524978637695,
      decimalLongitude: -2.517819881439209,
      countryCode: 'ES',
      stateProvince: 'Albacete',
      municipality: 'Villaverde de Guadalimar',
      georeferenceVerificationStatus: 'UNVERIFIED',
      identificationVerificationStatus: 'UNVERIFIED'
    },
    {
      id: 5170,
      institutionCode: 'MCNB',
      collectionCode: 'MCNB-Cord',
      catalogNumber: 'MZB 82-1661',
      basisOfRecord: 'NON_FOSSIL',
      taxonID: 8077224,
      decimalLongitude: 2.0063126,
      decimalLatitude: 41.3050933,
      eventDate: new Date('1920-11-19'),
      countryCode: 'ES',
      stateProvince: 'Barcelona',
      county: 'Baix Llobregat',
      municipality: 'Gavà',
      georeferenceVerificationStatus: 'UNVERIFIED',
      identificationVerificationStatus: 'UNVERIFIED'
    }, {
      id: 185125,
      institutionCode: 'MVHN',
      catalogNumber: '010210RT01',
      basisOfRecord: 'NON_FOSSIL',
      taxonID: 9476611,
      decimalLongitude: -0.6492975,
      decimalLatitude: 35.7032751,
      eventDate: new Date('2009-03-16'),
      countryCode: 'DZ',
      county: 'Orán',
      georeferenceVerificationStatus: 'UNVERIFIED',
      identificationVerificationStatus: 'UNVERIFIED'
    }, {
      id: 119550,
      institutionCode: 'UB',
      collectionCode: 'CARIMED',
      catalogNumber: 'B07_09052019_9544',
      basisOfRecord: 'NON_FOSSIL',
      taxonID: 8166676,
      decimalLongitude: 2.447341915,
      decimalLatitude: 41.6397236,
      eventDate: new Date('2019-05-09'),
      countryCode: 'ES',
      stateProvince: 'Barcelona',
      county: 'Vallès Oriental',
      georeferenceVerificationStatus: 'UNVERIFIED',
      identificationVerificationStatus: 'UNVERIFIED'
    },
    {
      id: 190590,
      institutionCode: 'IBB',
      collectionCode: 'BC',
      catalogNumber: '100000',
      basisOfRecord: 'NON_FOSSIL',
      taxonID: 8064370,
      decimalLongitude: -0.3527,
      decimalLatitude: 39.1552,
      countryCode: 'ES',
      stateProvince: 'V',
      georeferenceVerificationStatus: 'UNVERIFIED',
      identificationVerificationStatus: 'UNVERIFIED'
    }
  ]
};