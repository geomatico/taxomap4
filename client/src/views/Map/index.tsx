import React, {FC, useEffect, useMemo, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import useDictionaries from '../../hooks/useDictionaries';
import useSubtaxonCount from '../../hooks/useSubtaxonCount';
import {BBOX, Range, SubtaxonVisibility, Taxon, TaxonId, TaxonomicLevel} from '../../commonTypes';
import {useNavigate, useParams} from 'react-router-dom';
import {nextTaxonomicLevel} from '../../taxonomicLevelUtils';
import {INITIAL_TAXONOMIC_LEVEL, INITIAL_TAXONOMIC_NAME} from '../../config';
import {getIdByName} from '../../domain/usecases/getDictionaries';
import getTaxonChildren from '../../domain/usecases/getTaxonChildren';

export type IndexProps = {
  isTactile: boolean
}

const Index: FC<IndexProps> = ({isTactile}) => {
  const dictionaries = useDictionaries();
  const navigate = useNavigate();
  const {level, id} = useParams();

  const [selectedInstitutionId, setInstitutionId] = useState<number>();
  const [selectedBasisOfRecordId, setBasisOfRecordId] = useState<number>();
  const [selectedTaxon, setTaxon] = useState<Taxon>();
  const [selectedYearRange, setYearRange] = useState<Range>();
  const [BBOX, setBBOX] = useState<BBOX>();
  const [subtaxonVisibility, setSubtaxonVisibility] = useState<SubtaxonVisibility>();

  const filters = useMemo(() => selectedTaxon ? {
    taxon: selectedTaxon,
    institutionId: selectedInstitutionId,
    basisOfRecordId: selectedBasisOfRecordId,
    subtaxonVisibility: subtaxonVisibility,
    yearRange: selectedYearRange,
    bbox: BBOX
  } : undefined, [selectedTaxon, selectedInstitutionId, selectedBasisOfRecordId, subtaxonVisibility, selectedYearRange, BBOX]);

  useEffect(() => {
    if (!level || !id) {
      // si la url no tiene taxon seleccionado
      if (dictionaries[INITIAL_TAXONOMIC_LEVEL].length) {
        const initialTaxonId = getIdByName(dictionaries[INITIAL_TAXONOMIC_LEVEL], INITIAL_TAXONOMIC_NAME);
        navigate(`${INITIAL_TAXONOMIC_LEVEL}/${initialTaxonId}`);
      }
    } else if (selectedTaxon?.level !== level || selectedTaxon?.id !== parseInt(id)) {
      // si la url tiene taxon seleccionado y no cuadra con selectedTaxon (o no hay selectedTaxon)
      setTaxon({level: level as TaxonomicLevel, id: parseInt(id)});
    }
  }, [dictionaries, level, id]);

  useEffect(() => {
    if (selectedTaxon) {
      if (isTactile) {
        navigate(`../planetavida/${selectedTaxon.level}/${selectedTaxon.id}`);
      } else {
        navigate(`../map/${selectedTaxon.level}/${selectedTaxon.id}`);
      }
    }
  }, [selectedTaxon]);

  const subtaxonCount = useSubtaxonCount({
    institutionId: filters?.institutionId,
    basisOfRecordId: filters?.basisOfRecordId,
    yearRange: filters?.yearRange,
    taxon: filters?.taxon
  });

  const childrenItems = useMemo(
    () => getTaxonChildren(subtaxonCount, selectedTaxon, dictionaries),
    [subtaxonCount, selectedTaxon, dictionaries]);

  useEffect(() => {
    if (!childrenItems?.length || selectedTaxon === undefined) {
      return;
    }

    setSubtaxonVisibility((prevVisibility) => {
      const prevSubtaxonLevel = prevVisibility?.subtaxonLevel;
      const nextSubtaxonLevel = nextTaxonomicLevel(selectedTaxon.level);
      const levelChanged = prevSubtaxonLevel !== nextSubtaxonLevel;

      return {
        subtaxonLevel: nextSubtaxonLevel,
        isVisible: childrenItems.reduce((isVisible, count) => {
          // Keep visibility state if level didn't change
          isVisible[count.id] = levelChanged ? true : prevVisibility?.isVisible[count.id] ?? true;
          return isVisible;
        }, {} as Record<TaxonId, boolean>)
      };
    });
  }, [childrenItems]);

  if (!filters || !selectedTaxon || !childrenItems) {
    return <div>Loading...</div>;
  }

  const sidePanelContent = <SidePanelContent
    filters={filters}
    isTactile={isTactile}
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
