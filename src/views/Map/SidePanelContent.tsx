import React, {FC, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';
import Geomatico from '../../components/Geomatico';
import FilterByForm from '../../components/FilterByForm';
import TaxoTree from '../../components/TaxoTree';
import {AutocompleteVirtualized} from '../../components/AutocompleteVirtualized';
import Divider from '@mui/material/Divider';
import {BBOX, ChildCount, SubtaxonVisibility, Taxon, Range} from '../../commonTypes';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: 0,
});


type SidePanelContentProps = {
  institutionFilter?: number,
  onInstitutionFilterChange: (id: number) => void,
  basisOfRecordFilter?: number,
  yearFilter?: Range,
  onBasisOfRecordChange: (id: number) => void,
  selectedTaxon: Taxon,
  onTaxonChange: (taxon: Taxon) => void,
  BBOX?: BBOX,
  subtaxonVisibility?: SubtaxonVisibility,
  onSubtaxonVisibilityChanged: (visibility: SubtaxonVisibility) => void,
  childrenItems: Array<ChildCount>
}

const SidePanelContent: FC<SidePanelContentProps> = ({
  institutionFilter,
  onInstitutionFilterChange,
  basisOfRecordFilter,
  yearFilter,
  onBasisOfRecordChange,
  selectedTaxon,
  onTaxonChange,
  subtaxonVisibility,
  onSubtaxonVisibilityChanged,
  childrenItems,
  BBOX
}) => {
  const [filteredTaxon, setFilteredTaxon] = useState(null);

  useEffect(() => {
    if (filteredTaxon) onTaxonChange(filteredTaxon);
  }, [filteredTaxon]);

  useEffect(() => {
    if (selectedTaxon) onTaxonChange(selectedTaxon);
  }, [selectedTaxon]);

  return <Stack sx={{
    height: '100%',
    overflow: 'hidden'
  }}>
    <ScrollableContent>
      <FilterByForm
        institutionFilter={institutionFilter}
        onInstitutionFilterChange={onInstitutionFilterChange}
        basisOfRecordFilter={basisOfRecordFilter}
        onBasisOfRecordChange={onBasisOfRecordChange}
      />
      <Divider/>
      <Box px={2} py={2}>
        <AutocompleteVirtualized onFilteredTaxonChange={setFilteredTaxon}/>
      </Box>
      <TaxoTree
        selectedTaxon={selectedTaxon}
        onTaxonChanged={onTaxonChange}
        BBOX={BBOX}
        childrenItems={childrenItems}
        subtaxonVisibility={subtaxonVisibility}
        onSubtaxonVisibilityChanged={onSubtaxonVisibilityChanged}
        basisOfRecordFilter={basisOfRecordFilter}
        institutionFilter={institutionFilter}
        yearFilter={yearFilter}
      />
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

export default SidePanelContent;
