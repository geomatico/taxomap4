import React, {FC, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';
import FilterByForm from '../../components/FilterByForm';
import TaxoTree from '../../components/TaxoTree';
import {AutocompleteVirtualized} from '../../components/AutocompleteVirtualized';
import Divider from '@mui/material/Divider';
import {ChildCount, Filters, SubtaxonVisibility, Taxon} from '../../commonTypes';
import GeomaticoLink from '../../components/GeomaticoLink';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: 0,
  //
  // +arginBottom: 30,
});

type SidePanelContentProps = {
  filters : Filters,
  isTactile: boolean,
  onInstitutionFilterChange: (id: number) => void,
  onBasisOfRecordChange: (id: number) => void,
  onTaxonChange: (taxon: Taxon) => void,
  onSubtaxonVisibilityChanged: (visibility: SubtaxonVisibility) => void,
  childrenItems: Array<ChildCount>
}

const SidePanelContent: FC<SidePanelContentProps> = ({
  filters,
  isTactile,
  onInstitutionFilterChange,
  onBasisOfRecordChange,
  onTaxonChange,
  onSubtaxonVisibilityChanged,
  childrenItems
}) => {
  const [filteredTaxon, setFilteredTaxon] = useState(null);

  useEffect(() => {
    if (filteredTaxon) onTaxonChange(filteredTaxon);
  }, [filteredTaxon]);

  useEffect(() => {
    if (filters.taxon) onTaxonChange(filters.taxon);
  }, [filters.taxon]);

  return <Stack sx={{ height: '100%', overflow: 'auto', mb: 10 }}>
    <FilterByForm
      institutionFilter={filters.institutionId}
      onInstitutionFilterChange={onInstitutionFilterChange}
      basisOfRecordFilter={filters.basisOfRecordId}
      onBasisOfRecordChange={onBasisOfRecordChange}
    />
    <Divider/>
    <Box px={2} py={2}>
      <AutocompleteVirtualized onFilteredTaxonChange={setFilteredTaxon}/>
    </Box>
    <ScrollableContent>
      <TaxoTree
        filters={filters}
        isTactile={isTactile}
        onTaxonChanged={onTaxonChange}
        childrenItems={childrenItems}
        onSubtaxonVisibilityChanged={onSubtaxonVisibilityChanged}
      />
    </ScrollableContent>
    <GeomaticoLink/>
  </Stack>;
};

export default SidePanelContent;
