import React, {useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';
import {INITIAL_TAXON} from '../../config';

import useDictionaries from '../../hooks/useDictionaries';
import useTaxonChildren from '../../hooks/useTaxonChildren';
import useSubtaxonCount from '../../hooks/useSubtaxonCount';
import {BBOX, ChildCount, ChildrenVisibility, Taxon, YearRange} from '../../commonTypes';

const Index = () => {
  const dictionaries = useDictionaries();

  const [selectedInstitutionId, setInstitutionId] = useState<number>();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState<number>();
  const [selectedTaxon, setTaxon] = useState<Taxon>(INITIAL_TAXON);
  const [selectedYearRange, setYearRange] = useState<YearRange>();
  const [BBOX, setBBOX] = useState<BBOX>();
  const [childrenVisibility, setChildrenVisibility] = useState<ChildrenVisibility>();

  const subtaxonCount = useSubtaxonCount({
    institutionFilter: selectedInstitutionId,
    basisOfRecordFilter: selectedBasisOfRecordId,
    yearFilter: selectedYearRange,
    selectedTaxon
    //BBOX // TODO Los totales en TaxoTree van sin filtrar por BBOX. Tenemos que discutir si van filtrados por los demás criterios o no
  });

  const childrenItems: Array<ChildCount> = useTaxonChildren(subtaxonCount, selectedTaxon, dictionaries);

  useEffect(() => {
    if (childrenItems?.length) {
      const vis: Record<string, boolean> = {};
      childrenItems.forEach((el) => vis[el.id] = true);
      setChildrenVisibility(vis);
    }
  }, [childrenItems]);

  const sidePanelContent = <SidePanelContent
    institutionFilter={selectedInstitutionId}
    onInstitutionFilterChange={setInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    yearFilter={selectedYearRange}
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
