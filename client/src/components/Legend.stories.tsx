import React, {ComponentProps} from 'react';
import Legend from './Legend';
import {Meta, Story} from '@storybook/react';
import {SymbolizeBy, TaxonomicLevel} from '../commonTypes';

export default {
  title: 'Common/Legend',
  component: Legend,
} as Meta;

type LegendProps = ComponentProps<typeof Legend>;

const Template: Story<LegendProps> = (args) => (
  <Legend {...args}/>
);

export const Default = Template.bind({});
Default.args = {
  symbolizeBy: SymbolizeBy.phylum,
  filters: {
    taxon: {
      level: TaxonomicLevel.kingdom,
      id: 1
    },
    subtaxonVisibility: {
      subtaxonLevel: TaxonomicLevel.phylum,
      isVisible: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
        13: true,
        14: true,
        15: true,
        16: true,
        17: true,
        18: true,
        19: true,
        20: true,
        21: true
      }
    },
    bbox: [
      -15.597851562499999,
      34.64056279240191,
      19.997851562499978,
      47.52323758282868
    ]
  }
};
