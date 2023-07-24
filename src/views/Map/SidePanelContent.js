import React, {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';
import Geomatico from '../../components/Geomatico';
import PropTypes from 'prop-types';
import FilterByForm from '../../components/FilterByForm';
import TaxoTree from '../../components/TaxoTree';
import {TAXONOMIC_LEVELS} from '../../config';
import {AutocompleteVirtualized} from '../../components/AutocompleteVirtualized';
import Divider from '@mui/material/Divider';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: 0,
});

const SidePanelContent = ({childrenItems, institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange, selectedTaxon, onTaxonChange, childrenVisibility, onChildrenVisibilityChanged}) => {

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
        childrenItems={childrenItems}
        childrenVisibility={childrenVisibility}
        onChildrenVisibilityChanged={onChildrenVisibilityChanged}
      />
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  institutionFilter: PropTypes.number,
  onInstitutionFilterChange: PropTypes.func.isRequired,
  basisOfRecordFilter: PropTypes.number,
  onBasisOfRecordChange: PropTypes.func.isRequired,
  yearFilter: PropTypes.arrayOf(PropTypes.number),
  selectedTaxon: PropTypes.shape({
    level: PropTypes.oneOf(TAXONOMIC_LEVELS).isRequired,
    id: PropTypes.number.isRequired
  }).isRequired,
  onTaxonChange: PropTypes.func.isRequired,
  childrenVisibility: PropTypes.objectOf(PropTypes.bool),
  onChildrenVisibilityChanged: PropTypes.func,
  childrenItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    kingdom_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })),
};

export default SidePanelContent;
