import React, {ComponentProps} from 'react';
import {Meta, Story} from '@storybook/react';

import PopUpContent from './PopUpContent';

export default {
  title: 'Common/PopUpContent',
  component: PopUpContent,
  decorators: [
    (Story) => <div style={{margin: '20px'}}><Story/></div>
  ]
} as Meta;

type PopUpContentProps = ComponentProps<typeof PopUpContent>;

const Template: Story<PopUpContentProps> = args => <PopUpContent {...args}/>;

export const Default = Template.bind({});
Default.args = {
  selectedFeature: {
    id: 55951,
    catalognumber: 'MZB 2014-0557',
    species: {
      id: 766,
      genus_id: 3534,
      name: 'Anacridium aegyptium'
    },
    institutioncode: {
      id: 2,
      name: 'Museu Ciències Naturals Barcelona'
    },
    lat: 41.383515977377535,
    lon: -4.611523437500166
  }
};
