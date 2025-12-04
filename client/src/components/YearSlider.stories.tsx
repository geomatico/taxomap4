import React, {useState} from 'react';
import YearSlider, {RangeSliderProps} from './YearSlider';
import {Meta, Story} from '@storybook/react';
import {Range} from '../commonTypes';

export default {
  title: 'Charts/YearSlider',
  component: YearSlider,
  decorators: [
    (Story) => <div style={{width: '300px', margin: '40px'}}><Story/></div>
  ]
}  as Meta;

const dataExample: Record<number, number> = {
  1900: 61,
  1901: 40,
  1902: 33,
  1903: 68,
  1904: 9,
  1905: 30,
  1906: 25,
  1907: 36,
  1908: 78,
  1909: 106,
  1910: 125,
  1911: 75,
  1912: 90,
  1913: 70,
  1914: 132,
  1915: 171,
  1916: 231,
  1917: 599,
  1918: 992,
  1919: 1604,
  1920: 1105
};

const Template: Story<RangeSliderProps>  = (args) => <YearSlider {...args} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<RangeSliderProps> = ({ yearRange, onYearRangeChange, data, ...args}) => {

  const [getSelectedYear, setSelectedYear] = useState(yearRange);

  const handleSetSelectedYear =(value: Range | undefined)=> setSelectedYear(value);
  return <YearSlider yearRange={getSelectedYear} onYearRangeChange={handleSetSelectedYear} data={dataExample} {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  data: dataExample,
  yearRange: [1900, 1910]
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};
