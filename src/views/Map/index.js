import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

const Index = () => {

  const [selectedInstitutionId, setInstitutionId] = useState();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState();
  const [selectedYearRange, setYearRange] = useState([1991, 1994]);

  const selectedTaxon = undefined; // TODO MCNB-55 Arbre taxonòmic navegable

  const sidePanelContent = <SidePanelContent
    institutionFilter={selectedInstitutionId}
    onInstitutionFilterChange={setInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    onBasisOfRecordChange={setBasisOfRecordId}
  />;

  const mainContent = <MainContent
    yearFilter={selectedYearRange}
    onYearFilterChange={setYearRange}
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
