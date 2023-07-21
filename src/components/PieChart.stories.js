import React from 'react';
import PieChart from './PieChart';

export default {
  title: 'Charts/PieChart',
  component: PieChart
};

const data = [
  {
    'label': 'Label-1',
    'color': '#FABB5C',
    'percentage': 30
  },
  {
    'label': 'Label-2',
    'color': '#58A062',
    'percentage': 25
  },
  {
    'label': 'Label-3',
    'color': '#F07971',
    'percentage': 15
  },
  {
    'label': 'Label-4',
    'color': '#54BFDE',
    'percentage': 20
  },
  {
    'label': 'Label-5',
    'color': '#666666',
    'percentage': 10
  },
];

const Template = args => <PieChart {...args}/>;

export const Default = Template.bind({});
Default.args = {
  data: data,
};