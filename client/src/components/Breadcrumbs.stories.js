import React, {useState} from 'react';
import Breadcrumbs from './Breadcrumbs';

export default {
  title: 'Common/Breadcrumbs',
  component: Breadcrumbs
};

const Template = args => <Breadcrumbs {...args}/>;

export const Default = Template.bind({});
Default.args = {
  tree: [    {level: 'domain', id: 1, label: 'Eukaryota'},
    {level: 'kingdom', id: 2, label: 'Plantae'},
    {level: 'phylum', id: 5, label: 'Tracheophyta'},
    {level: 'class', id: 7, label: 'Magnoliopsida'},
    {level: 'order', id: 39, label: 'Asparagales'},
    {level: 'family', id: 99, label: 'Orchidaceae'},
    {level: 'genus', id: 155, label: 'Orchis'},
    {level: 'species', id: 13641, label: 'Orchis laxiflora'},
    {level: 'subspecies', id: 14800, label: 'Orchis laxiflora palustris'}]
};

export const OneItem = Template.bind({});
OneItem.args = {
  tree: [{level: 'domain', id: 1, label: 'Eukaryota'},]
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate = ({value, onChange, ...args}) => {
  const [getValue, setValue] = useState(value);
  return <Breadcrumbs onChange={setValue} value={getValue} {...args} />;
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  tree: [
    {level: 'domain', id: 1, label: 'Eukaryota'},
    {level: 'kingdom', id: 2, label: 'Plantae'},
    {level: 'phylum', id: 5, label: 'Tracheophyta'},
    {level: 'class', id: 7, label: 'Magnoliopsida'},
    {level: 'order', id: 39, label: 'Asparagales'},
    {level: 'family', id: 99, label: 'Orchidaceae'},
    {level: 'genus', id: 155, label: 'Orchis'},
    {level: 'species', id: 13641, label: 'Orchis laxiflora'},
    {level: 'subspecies', id: 14800, label: 'Orchis laxiflora palustris'}
  ]
};