import React from 'react';
import {Meta, Story} from '@storybook/react';

import TaxoTable, {TaxoTableProps} from './TaxoTable';

export default {
  title: 'TaxoTable',
  component: TaxoTable
} as Meta;

const Template: Story<TaxoTableProps> = args => <TaxoTable {...args}/>;

export const Default = Template.bind({});
Default.args = {
  data: [
    {
      index: 0,
      catalogNumber: '181219HH10',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Bithynia tentaculata',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Littorinimorpha',
      family: 'Bithyniidae',
      genus: 'Bithynia',
      specificepithet: 'tentaculata'
    },
    {
      index: 1,
      catalogNumber: '090120PK01',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Aplus assimilis',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Neogastropoda',
      family: 'Pissaniidae',
      genus: 'Aplus',
      specificepithet: 'assimilis'
    },
    {
      index: 2,
      catalogNumber: '280120VE01',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Aplus assimilis',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Neogastropoda',
      family: 'Pissaniidae',
      genus: 'Aplus',
      specificepithet: 'assimilis'
    },
    {
      index: 3,
      catalogNumber: '280120VE02',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Aplus assimilis',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Neogastropoda',
      family: 'Pissaniidae',
      genus: 'Aplus',
      specificepithet: 'assimilis'
    },
    {
      index: 4,
      catalogNumber: '280120VE03',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Mitrella psilla',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Neogastropoda',
      family: 'Columbellidae',
      genus: 'Mitrella',
      specificepithet: 'psilla'
    },
    {
      index: 5,
      catalogNumber: '280120VE04',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Brachidontes pharaonis',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Bivalva',
      order: 'Mytilida',
      family: 'Mytilidae',
      genus: 'Brachidontes',
      specificepithet: 'pharaonis'
    },
    {
      index: 6,
      catalogNumber: '010220BT01',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Fulvia fragilis',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Bivalva',
      order: 'Cardiida',
      family: 'Cardiidae',
      genus: 'Fulvia',
      specificepithet: 'fragilis'
    },
    {
      index: 7,
      catalogNumber: '120220RT01',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Aplus assimilis',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Neogastropoda',
      family: 'Pissaniidae',
      genus: 'Aplus',
      specificepithet: 'assimilis'
    },
    {
      index: 8,
      catalogNumber: '060320UY02',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Graniberia braunii',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Stylommatophora',
      family: 'Chondrinidae',
      genus: 'Graniberia',
      specificepithet: 'braunii'
    },
    {
      index: 9,
      catalogNumber: '060320UY04',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Xerolenta obvia',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Stylommatophora',
      family: 'Geomitridae',
      genus: 'Xerolenta',
      specificepithet: 'obvia'
    },
    {
      index: 10,
      catalogNumber: '120220FM01',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Teredo navalis',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Bivalva',
      order: 'Myida',
      family: 'Teredinidae',
      genus: 'Teredo',
      specificepithet: 'navalis'
    },
    {
      index: 11,
      catalogNumber: '120220FM02',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Crassostraea gigas',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Bivalva',
      order: 'Ostreida',
      family: 'Ostreidae',
      genus: 'Crassostraea',
      specificepithet: 'gigas'
    },
    {
      index: 12,
      catalogNumber: '120220FM03',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Semicassis granulata',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Littorinimorpha',
      family: 'Cassidae',
      genus: 'Semicassis',
      specificepithet: 'granulata'
    },
    {
      index: 13,
      catalogNumber: '120220FM04',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Cthalmalus stellatus',
      kingdom: 'Animalia',
      phylum: 'Arthropoda',
      class: 'Hexanauplia',
      order: 'Sessilia',
      family: 'Cthalmalidae',
      genus: 'Cthalmalus',
      specificepithet: 'stellatus'
    },
    {
      index: 14,
      catalogNumber: '270320YR02',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Helicella itala',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Stylommatophora',
      family: 'Geomitridae',
      genus: 'Helicella',
      specificepithet: 'itala'
    },
    {
      index: 15,
      catalogNumber: '220420YT01',
      institutionCode: 'MVHN',
      basisOfRecord: 'PreservedSpecimen',
      scientificName: 'Corbellaria celtiberica',
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Gastropoda',
      order: 'Caenogastropoda',
      family: 'Hydrobiidae',
      genus: 'Corbellaria',
      specificepithet: 'celtiberica'
    }
  ]
};