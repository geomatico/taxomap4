import React, {useState} from 'react';
import TaxoTree from './TaxoTree';
import {INITIAL_TAXON} from '../config';

export default {
  title: 'Common/TaxoTree',
  component: TaxoTree,
};

const Template = (args) => <TaxoTree {...args} />;

// eslint-disable-next-line react/prop-types,no-unused-vars
const ManagedTemplate = ({selectedTaxon, onTaxonChanged, ...other}) => {
  const [getTaxon, setTaxon] = useState(selectedTaxon);
  return <TaxoTree selectedTaxon={getTaxon} onTaxonChanged={setTaxon} {...other} />;
};

export const Default = Template.bind({});
Default.args = {
  selectedTaxon: INITIAL_TAXON
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};
