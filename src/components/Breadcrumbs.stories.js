import React, {useState} from 'react';
import Breadcrumbs from './Breadcrumbs';

export default {
  title: 'Common/Breadcrumbs',
  component: Breadcrumbs
};

const Template = args => <Breadcrumbs {...args}/>;

export const Default = Template.bind({});
Default.args = {
  tree: ['Eukaryota', 'Animalia', 'Chordata', 'Aves', 'Passeriformes']
};

export const OneItem = Template.bind({});
Default.args = {
  tree: ['Eukaryota']
};

// eslint-disable-next-line react/prop-types,no-unused-vars
const ManagedTemplate = ({value, onChange, ...args}) => {
  const [getValue, setValue] = useState(value);
  return <Breadcrumbs onChange={setValue} value={getValue} {...args} />;
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};