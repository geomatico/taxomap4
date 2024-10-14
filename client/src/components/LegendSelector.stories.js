import React, {useState} from 'react';
import LegendSelector from './LegendSelector';

export default {
  title: 'Common/LegendSelector',
  component: LegendSelector,
  decorators: [(Story) => <div style={{position: 'absolute', bottom: 0, right: 0}}><Story/></div>]
};

const Template = (args) => <LegendSelector {...args} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate = ({symbolizeBy, onSymbolizeByChange, ...other}) => {
  const [getValue, setValue] = useState(symbolizeBy);
  return <LegendSelector symbolizeBy={getValue} onSymbolizeByChange={setValue} {...other} />;
};

export const Default = Template.bind({});
Default.args = {
  symbolizeBy: 'phylum'
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};
