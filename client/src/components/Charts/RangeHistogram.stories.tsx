import React, {useState} from 'react';
import RangeHistogram, {RangeHistogramProps} from './RangeHistogram';
import {Meta, Story} from '@storybook/react';
import {Range} from '../../commonTypes';

export default {
  title: 'Common/RangeHistogram',
  component: RangeHistogram,
  decorators: [
    (Story) => <div style={{width: '300px', margin: '40px'}}><Story/></div>
  ]
}  as Meta;

const Template: Story<RangeHistogramProps>  = (args) => <RangeHistogram {...args} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<RangeHistogramProps> = ({ value, onValueChange, ...args}) => {

  const [getSelectedYear, setSelectedYear] = useState(value);

  const handleSetSelectedYear = (value: Range | undefined) => value && setSelectedYear(value);
  return <RangeHistogram value={getSelectedYear} onValueChange={handleSetSelectedYear} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data: {
    1900: 10
  },
  value: [1990, 2000]
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};