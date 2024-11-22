import React from 'react';
import {Meta, Story} from '@storybook/react';
import BreadcrumItem, {BreadcrumbItemProps} from './BreadcrumItem';

export default {
  title: 'Common/BreadcrumItem',
  component: BreadcrumItem
} as Meta;

const Template: Story<BreadcrumbItemProps> = args => <BreadcrumItem {...args}/>;

export const Default = Template.bind({});
Default.args = {
  label: 'Eukaryota',
  last: false
};

export const Last = Template.bind({});
Last.args = {
  label: 'Animalia',
  last: true
};