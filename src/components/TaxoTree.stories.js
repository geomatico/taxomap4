import React from 'react';
import TaxoTree from './SectionTitle';

export default {
  title: 'Common/TaxoTree',
  component: TaxoTree,
};

const Template = (args) => <TaxoTree {...args} />;

export const Default = Template.bind({});
Default.args = {
  titleKey: 'baseMapStyle',
};
