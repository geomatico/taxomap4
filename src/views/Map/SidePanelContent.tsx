import React, {FC, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';
import Geomatico from '../../components/Geomatico';
import FilterByForm from '../../components/FilterByForm';
import TaxoTree from '../../components/TaxoTree';
import {AutocompleteVirtualized} from '../../components/AutocompleteVirtualized';
import Divider from '@mui/material/Divider';
import {BBOX, ChildCount, ChildrenVisibility, Taxon} from '../../commonTypes';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: 0,
});


type SidePanelContentProps = {
  institutionFilter?: number,
  onInstitutionFilterChange: (id: number) => void,
  basisOfRecordFilter?: number,
  onBasisOfRecordChange: (id: number) => void,
  selectedTaxon: Taxon,
  onTaxonChange: (taxon: Taxon) => void,
  BBOX?: BBOX,
  childrenVisibility?: ChildrenVisibility,
  onChildrenVisibilityChanged: (visibility: ChildrenVisibility) => void,
  childrenItems: Array<ChildCount>
}

const SidePanelContent: FC<SidePanelContentProps> = ({
  institutionFilter,
  onInstitutionFilterChange,
  basisOfRecordFilter,
  onBasisOfRecordChange,
  selectedTaxon,
  onTaxonChange,
  childrenVisibility,
  onChildrenVisibilityChanged,
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
        childrenVisibility={childrenVisibility}
        onChildrenVisibilityChanged={onChildrenVisibilityChanged}
      />
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

export default SidePanelContent;
