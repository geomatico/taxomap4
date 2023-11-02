import React, {useState} from 'react';
import TaxoTree, {TaxoTreeProps} from './TaxoTree';
import {INITIAL_TAXON} from '../config';
import {Meta, Story} from '@storybook/react';
import {SubtaxonVisibility, TaxonomicLevel} from '../commonTypes';

export default {
  title: 'Common/TaxoTree',
  component: TaxoTree,
} as Meta;

const subtaxonVisibility: SubtaxonVisibility = {
  subtaxonLevel: TaxonomicLevel.phylum,
  isVisible: {
    1: false,
    2: true,
    3: true,
    4: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
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
};

const Template: Story<TaxoTreeProps> = (args) => <TaxoTree {...args} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<TaxoTreeProps> = ({filters, onTaxonChanged, onSubtaxonVisibilityChanged, ...other}) => {
  const [selectedTaxon, setTaxon] = useState(filters.taxon);
  const [subtaxonVisibility, setSubtaxonVisibility] = useState(filters.subtaxonVisibility);
  return <TaxoTree filters={({taxon: selectedTaxon, subtaxonVisibility})}
    onTaxonChanged={setTaxon}
    onSubtaxonVisibilityChanged={setSubtaxonVisibility} {...other} />;
};

export const Default = Template.bind({});
Default.args = {
  filters: {
    taxon: INITIAL_TAXON,
    subtaxonVisibility
  }
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};

export const ManagedWithoutVisibility = ManagedTemplate.bind({});
ManagedWithoutVisibility.args = {
  filters: {
    taxon: INITIAL_TAXON,
    subtaxonVisibility: undefined
  }
};
