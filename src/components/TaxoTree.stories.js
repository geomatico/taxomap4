import React, {useState} from 'react';
import TaxoTree from './TaxoTree';

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
  selectedTaxon: {
    level: 'kingdom',
    id: 1
  }
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};
