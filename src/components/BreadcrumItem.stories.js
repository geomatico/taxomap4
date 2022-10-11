import React, {useState} from 'react';
import BreadcrumItem from './BreadcrumItem';

export default {
  title: 'Common/BreadcrumItem',
  component: BreadcrumItem
};

const Template = args => <BreadcrumItem {...args}/>;

export const Default = Template.bind({});
Default.args = {
  name: 'Eukaryota',
  last: false
};

export const Last = Template.bind({});
Last.args = {
  name: 'Animalia',
  last: true
};

// eslint-disable-next-line react/prop-types,no-unused-vars
const ManagedTemplate = ({value, onChange, ...args}) => {
  const [getValue, setValue] = useState(value);
  return <BreadcrumItem onChange={setValue} value={getValue} {...args} />;
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};