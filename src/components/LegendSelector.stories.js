import React from 'react';
import LegendSelector from './LegendSelector';

export default {
  title: 'Common/LegendSelector',
  component: LegendSelector,
  decorators: [(Story) => <div style={{position: 'absolute', bottom: 0, right: 0}}><Story/></div>]
};

const Template = (args) => <LegendSelector {...args} />;

export const Default = Template.bind({});
Default.args = {

};
