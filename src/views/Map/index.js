import React, {useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';
import {INITIAL_TAXON} from '../../config';

const Index = () => {

  const [selectedInstitutionId, setInstitutionId] = useState();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState();
  const [selectedTaxon, setTaxon] = useState(INITIAL_TAXON);
  const [childrenVisibility, setChildrenVisibility] = useState();
  const [selectedYearRange, setYearRange] = useState();

  useEffect(()=> {
    // con selectedTaxon pedir sus subtaxons, y sacar objeto de visibilidad todo a true por defecto
    const visibility = {1: true, 2: false, 3: true, 4: false};
    setChildrenVisibility(visibility);
  }, [selectedTaxon]);

  const sidePanelContent = <SidePanelContent
    institutionFilter={selectedInstitutionId}
    onInstitutionFilterChange={setInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    onBasisOfRecordChange={setBasisOfRecordId}
    yearFilter={selectedYearRange}
    selectedTaxon={selectedTaxon}
    onTaxonChange={setTaxon}
    childrenVisibility={childrenVisibility}
    onChildrenVisibilityChanged={setChildrenVisibility}
  />;

  const mainContent = <MainContent
    institutionFilter={selectedInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    yearFilter={selectedYearRange}
    onYearFilterChange={setYearRange}
    taxonFilter={selectedTaxon}
    childrenVisibility={childrenVisibility}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
    selectedTaxon={selectedTaxon}
    onTaxonChange={setTaxon}
  />;
};

export default Index;
