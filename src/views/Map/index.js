import React, {useEffect, useMemo, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';
import {INITIAL_TAXON} from '../../config';

import useDictionaries from '../../hooks/useDictionaries';
import useTaxonChildren from '../../hooks/useTaxonChildren';
import useSubtaxonCount from '../../hooks/useSubtaxonCount';

const Index = () => {
  const dictionaries = useDictionaries();

  const [selectedInstitutionId, setInstitutionId] = useState();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState();
  const [selectedTaxon, setTaxon] = useState(INITIAL_TAXON);
  const [selectedYearRange, setYearRange] = useState();
  const [BBOX, setBBOX] = useState();
  const [childrenItems, setChildren] = useState();
  const [childrenVisibility, setChildrenVisibility] = useState();

  const subtaxonCount = useSubtaxonCount({
    selectedInstitutionId,
    selectedBasisOfRecordId,
    selectedYearRange,
    selectedTaxon
  });
  const children = useTaxonChildren(subtaxonCount, selectedTaxon, dictionaries);

  useMemo(() => {
    if(children.length && JSON.stringify(childrenItems) !== JSON.stringify(children)) setChildren(children);
  }, [children]);

  useEffect(() => {
    if (childrenItems?.length) {
      const vis = {};
      childrenItems.forEach((el) => vis[el.id] = true);
      setChildrenVisibility(vis);
    }
  }, [childrenItems]);

  const sidePanelContent = <SidePanelContent
    institutionFilter={selectedInstitutionId}
    onInstitutionFilterChange={setInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    onBasisOfRecordChange={setBasisOfRecordId}
    selectedTaxon={selectedTaxon}
    onTaxonChange={setTaxon}
    BBOX={BBOX}
    childrenItems={childrenItems}
    childrenVisibility={childrenVisibility}
    onChildrenVisibilityChanged={setChildrenVisibility}
  />;

  const mainContent = <MainContent
    institutionFilter={selectedInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    yearFilter={selectedYearRange}
    onYearFilterChange={setYearRange}
    taxonFilter={selectedTaxon}
    onBBOXChanged={setBBOX}
    BBOX={BBOX}
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
