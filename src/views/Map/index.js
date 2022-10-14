import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';
import {INITIAL_TAXON} from '../../config';

const Index = () => {

  const [selectedInstitutionId, setInstitutionId] = useState();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState();
  const [selectedTaxon, setTaxon] = useState(INITIAL_TAXON);

  const sidePanelContent = <SidePanelContent
    institutionFilter={selectedInstitutionId}
    onInstitutionFilterChange={setInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    onBasisOfRecordChange={setBasisOfRecordId}
    selectedTaxon={selectedTaxon}
    onTaxonChange={setTaxon}
  />;

  const mainContent = <MainContent
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
