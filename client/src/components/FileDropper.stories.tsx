import React from 'react';
import {Meta, Story} from '@storybook/react';

import FileDropper, {FileDropperProps} from './FileDropper';

export default {
  title: 'FileDropper',
  component: FileDropper
} as Meta;

const Template: Story<FileDropperProps> = args => <FileDropper {...args}/>;

export const Default = Template.bind({});
Default.args = {
  
};