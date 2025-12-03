import React from 'react';
import {Meta, Story} from '@storybook/react';

import TableDocumentation from './TableDocumentation';

export default {
  title: 'TableDocumentation',
  component: TableDocumentation
} as Meta;

const Template: Story = args => <div style={{margin: '20px', width: '300px'}}><TableDocumentation {...args}/></div>;

export const Default = Template.bind({});
Default.args = {

};