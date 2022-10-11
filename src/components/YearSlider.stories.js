import React, {useState} from 'react';
import YearSlider from './YearSlider';

export default {
  title: 'Common/YearSlider',
  component: YearSlider,
  decorators: [
    (Story) => <div style={{width: '300px', margin: '40px'}}><Story/></div>
  ]
};

const Template = (args) => <YearSlider {...args} />;

// eslint-disable-next-line react/prop-types,no-unused-vars
const ManagedTemplate = ({ yearRange, onYearRangeChange, ...args}) => {

  const [getSelectedYear, setSelectedYear] = useState(yearRange);

  const handleSetSelectedYear =(value)=> setSelectedYear(value);
  return <YearSlider yearRange={getSelectedYear} onYearRangeChange={handleSetSelectedYear} {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  yearRange: [1994, 1995],
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {...Default.args};

