import React, {useState} from 'react';
import YearSlider, {RangeSliderProps} from './YearSlider';
import {Meta, Story} from '@storybook/react';
import {YearRange} from '../commonTypes';

export default {
  title: 'Common/YearSlider',
  component: YearSlider,
  decorators: [
    (Story) => <div style={{width: '300px', margin: '40px'}}><Story/></div>
  ]
}  as Meta;

const Template: Story<RangeSliderProps>  = (args) => <YearSlider {...args} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<RangeSliderProps> = ({ yearRange, onYearRangeChange, ...args}) => {

  const [getSelectedYear, setSelectedYear] = useState(yearRange);

  const handleSetSelectedYear =(value: YearRange | undefined)=> setSelectedYear(value);
  return <YearSlider yearRange={getSelectedYear} onYearRangeChange={handleSetSelectedYear} {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  yearRange: [1990, 2000],
  minYear: 1980,
  maxYear: 2020
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};
