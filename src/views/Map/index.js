import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';
import {INITIAL_TAXON} from '../../config';

const Index = () => {

  const [selectedInstitutionId, setInstitutionId] = useState();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState();
  const [selectedTaxon, setTaxon] = useState(INITIAL_TAXON);
  const [selectedYearRange, setYearRange] = useState();

  const sidePanelContent = <SidePanelContent
    institutionFilter={selectedInstitutionId}
    onInstitutionFilterChange={setInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    onBasisOfRecordChange={setBasisOfRecordId}
    yearFilter={selectedYearRange}
    selectedTaxon={selectedTaxon}
    onTaxonChange={setTaxon}
  />;

  const mainContent = <MainContent
    institutionFilter={selectedInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    yearFilter={selectedYearRange}
    onYearFilterChange={setYearRange}
    taxonFilter={selectedTaxon}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
    selectedTaxon={selectedTaxon}
    onTaxonChange={setTaxon}
  />;
};

export default Index;
