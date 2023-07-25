import React, {useState} from 'react';
import TaxoTree from './TaxoTree';
import {INITIAL_TAXON} from '../config';

export default {
  title: 'Common/TaxoTree',
  component: TaxoTree,
};

const subtaxonVisibility = {
  3: true,
  1: false,
  2: false,
  11: true,
  8: true,
};

const Template = (args) => <TaxoTree {...args} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate = ({selectedTaxon, onTaxonChanged,childrenVisibility, onChildrenVisibilityChanged, ...other}) => {
  const [getTaxon, setTaxon] = useState(selectedTaxon);
  const [getChildrenVisibility, setChildrenVisibility] = useState(childrenVisibility);
  return <TaxoTree selectedTaxon={getTaxon} onTaxonChanged={setTaxon} childrenVisibility={getChildrenVisibility} onChildrenVisibilityChanged={setChildrenVisibility} {...other} />;
};

export const Default = Template.bind({});
Default.args = {
  selectedTaxon: INITIAL_TAXON,
  childrenVisibility: subtaxonVisibility
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};

export const ManagedWithoutVisibility = ManagedTemplate.bind({});
ManagedWithoutVisibility.args = {
  selectedTaxon: INITIAL_TAXON,
  childrenVisibility: undefined
};
