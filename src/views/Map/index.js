import React from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

const Index = () => {
  const sidePanelContent = <SidePanelContent/>;
  const mainContent = <MainContent/>;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Index;
