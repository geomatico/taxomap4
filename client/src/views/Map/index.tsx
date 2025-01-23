import React, {FC, useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';
import {INITIAL_TAXON} from '../../config';

import useDictionaries from '../../hooks/useDictionaries';
import useTaxonChildren from '../../hooks/useTaxonChildren';
import useSubtaxonCount from '../../hooks/useSubtaxonCount';
import {BBOX, ChildCount, SubtaxonVisibility, Taxon, TaxonId, TaxonomicLevel, Range, Filters} from '../../commonTypes';
import {useNavigate, useParams} from 'react-router-dom';
import {nextTaxonomicLevel} from '../../taxonomicLevelUtils';

export type IndexProps = {
  isTactile: boolean
}

const Index: FC<IndexProps> = ({isTactile}) => {
  const dictionaries = useDictionaries();
  const navigate = useNavigate();
  const {level, id} = useParams();

  const [selectedInstitutionId, setInstitutionId] = useState<number>();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState<number>();
  const [selectedTaxon, setTaxon] = useState<Taxon>(INITIAL_TAXON);
  const [selectedYearRange, setYearRange] = useState<Range>();
  const [BBOX, setBBOX] = useState<BBOX>();
  const [subtaxonVisibility, setSubtaxonVisibility] = useState<SubtaxonVisibility>();

  const filters: Filters = {
    taxon: selectedTaxon,
    institutionId: selectedInstitutionId,
    basisOfRecordId: selectedBasisOfRecordId,
    subtaxonVisibility: subtaxonVisibility,
    yearRange: selectedYearRange,
    bbox: BBOX
  };

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
    if(selectedTaxon) {
      if (isTactile) {
        navigate(`../tactile/map/${selectedTaxon.level}/${selectedTaxon.id}`);
      } else {
        navigate(`../map/${selectedTaxon.level}/${selectedTaxon.id}`);
      }
    }
  },[selectedTaxon]);


  const subtaxonCount = useSubtaxonCount({
    institutionId: filters.institutionId,
    basisOfRecordId: filters.basisOfRecordId,
    yearRange: filters.yearRange,
    taxon : filters.taxon
  });

  const childrenItems: Array<ChildCount> = useTaxonChildren(subtaxonCount, selectedTaxon, dictionaries);

  useEffect(() => {
    if (childrenItems?.length) {
      setSubtaxonVisibility((prevVisibility) => {
        const prevSubtaxonLevel = prevVisibility?.subtaxonLevel;
        const nextSubtaxonLevel = nextTaxonomicLevel(selectedTaxon.level);
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
    filters={filters}
    onInstitutionFilterChange={setInstitutionId}
    onBasisOfRecordChange={setBasisOfRecordId}
    onTaxonChange={setTaxon}
    childrenItems={childrenItems}
    onSubtaxonVisibilityChanged={setSubtaxonVisibility}
  />;

  const mainContent = <MainContent
    filters={filters}
    isTactile={isTactile}
    onYearFilterChange={setYearRange}
    onBBOXChanged={setBBOX}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
    selectedTaxon={selectedTaxon}
    isTactile={isTactile}
    onTaxonChange={setTaxon}
  />;
};

export default Index;
