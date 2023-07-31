import React, {useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';
import {INITIAL_TAXON, TAXONOMIC_LEVELS} from '../../config';

import useDictionaries from '../../hooks/useDictionaries';
import useTaxonChildren from '../../hooks/useTaxonChildren';
import useSubtaxonCount from '../../hooks/useSubtaxonCount';
import {BBOX, ChildCount, SubtaxonVisibility, Taxon, TaxonId, TaxonomicLevel, YearRange} from '../../commonTypes';
import {useNavigate, useParams} from 'react-router-dom';

const Index = () => {
  const dictionaries = useDictionaries();
  const navigate = useNavigate();
  const {level, id} = useParams();

  const [selectedInstitutionId, setInstitutionId] = useState<number>();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState<number>();
  const [selectedTaxon, setTaxon] = useState<Taxon>(INITIAL_TAXON);
  const [selectedYearRange, setYearRange] = useState<YearRange>();
  const [BBOX, setBBOX] = useState<BBOX>();
  const [subtaxonVisibility, setSubtaxonVisibility] = useState<SubtaxonVisibility>();

  useEffect(()=>{
    // si la url no tiene taxon seleccionado
    if(selectedTaxon && !level && !id){
      navigate(`${selectedTaxon.level}/${selectedTaxon.id}`);
    } else if(level && id && selectedTaxon.level !== level){
      // si el level es diferente al initial Level ( cargo una url con un taxon seleccionado)
      const newSelectedTaxon: Taxon = {level: level as TaxonomicLevel, id: parseInt(id)};
      setTaxon(newSelectedTaxon);
    }

  },[]);

  useEffect(()=>{
    if(selectedTaxon) navigate(`../map/${selectedTaxon.level}/${selectedTaxon.id}`);
  },[selectedTaxon]);


  const subtaxonCount = useSubtaxonCount({
    institutionFilter: selectedInstitutionId,
    basisOfRecordFilter: selectedBasisOfRecordId,
    yearFilter: selectedYearRange,
    selectedTaxon
  });

  const childrenItems: Array<ChildCount> = useTaxonChildren(subtaxonCount, selectedTaxon, dictionaries);

  useEffect(() => {
    if (childrenItems?.length) {
      setSubtaxonVisibility((prevVisibility) => {
        const prevSubtaxonLevel = prevVisibility?.subtaxonLevel;
        const nextSubtaxonLevel = TAXONOMIC_LEVELS[TAXONOMIC_LEVELS.indexOf(selectedTaxon.level) + 1] as TaxonomicLevel;
        const levelChanged = prevSubtaxonLevel !== nextSubtaxonLevel;

        return {
          subtaxonLevel: nextSubtaxonLevel,
          isVisible: childrenItems.reduce((isVisible, count) => {
            isVisible[count.id] = levelChanged ? true : prevVisibility?.isVisible[count.id] ?? true; // Keep visibility state if level didn't change
            return isVisible;
          }, {} as Record<TaxonId, boolean>)
        };
      });
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
    subtaxonVisibility={subtaxonVisibility}
    onSubtaxonVisibilityChanged={setSubtaxonVisibility}
  />;

  const mainContent = <MainContent
    institutionFilter={selectedInstitutionId}
    basisOfRecordFilter={selectedBasisOfRecordId}
    yearFilter={selectedYearRange}
    onYearFilterChange={setYearRange}
    taxonFilter={selectedTaxon}
    onBBOXChanged={setBBOX}
    BBOX={BBOX}
    subtaxonVisibility={subtaxonVisibility}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
    selectedTaxon={selectedTaxon}
    onTaxonChange={setTaxon}
  />;
};

export default Index;
