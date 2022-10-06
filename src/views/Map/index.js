import React from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

const Index = () => {
  const selectedInstitutionId = undefined; // TODO MCNB-59 Filtrado por Institucion, Basis Of Record
  const selectedBasisOfRecordId = undefined; // TODO MCNB-59 Filtrado por Institucion, Basis Of Record
  const selectedYearRange = undefined; // TODO MCNB-58 Filtrado por Rango de Años
  const selectedTaxon = undefined; // TODO MCNB-55 Arbre taxonòmic navegable

  const sidePanelContent = <SidePanelContent/>;
  const mainContent = <MainContent
    yearFilter={selectedYearRange}
    institutionFilter={selectedInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    taxonFilter={selectedTaxon}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Index;
