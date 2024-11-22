import React from 'react';
import PieChart, {ChartData, PieChartProps} from './PieChart';
import {Meta, Story} from '@storybook/react';

export default {
  title: 'Charts/PieChart',
  component: PieChart
} as Meta;

const data: ChartData = [
  {
    label: 'Label-1',
    id: 1,
    color: '#FABB5C',
    percentage: 35
  },
  {
    label: 'Label-2',
    id: 2,
    color: '#58A062',
    percentage: 20
  },
  {
    label: 'Label-3',
    id: 3,
    color: '#F07971',
    percentage: 15
  },
  {
    label: 'Label-4',
    id: 4,
    color: '#54BFDE',
    percentage: 20
  },
  {
    label: 'Label-5',
    id: 5,
    color: '#666666',
    percentage: 10
  },
];

const Template: Story<PieChartProps> = args => <PieChart {...args}/>;

export const Default = Template.bind({});
Default.args = {
  data: data,
};