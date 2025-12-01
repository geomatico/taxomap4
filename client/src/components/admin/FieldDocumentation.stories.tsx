import React from 'react';
import {Meta, Story} from '@storybook/react';

import FieldDocumentation, {FieldDocumentationProps} from './FieldDocumentation';

export default {
  title: 'FieldDocumentation',
  component: FieldDocumentation
} as Meta;

const Template: Story<FieldDocumentationProps> = args => <FieldDocumentation {...args}/>;

export const Default = Template.bind({});
Default.args = {
  fieldName: 'institutionCode',
  required: true,
  restrictions: 'Solo puede tomar los valores IMEDEA | MCNB | UB | IBB',
  description: 'Código de la institución que aloja la colección',
  example: 'IMEDEA'
};