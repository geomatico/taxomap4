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

const SidePanelContent = ({institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange, yearFilter, selectedTaxon, onTaxonChange, BBOX}) => {

  const [filteredTaxon, setFilteredTaxon] = useState(null);

  useEffect(() => {
    if (filteredTaxon) onTaxonChange(filteredTaxon);
  }, [filteredTaxon]);

  useEffect(() => {
    if (selectedTaxon) onTaxonChange(selectedTaxon);
  }, [selectedTaxon]);

  return <Stack sx={{height: '100%', overflow: 'hidden'}}>
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
        institutionFilter={institutionFilter}
        basisOfRecordFilter={basisOfRecordFilter}
        yearFilter={yearFilter}
        selectedTaxon={selectedTaxon}
        onTaxonChanged={onTaxonChange}
        BBOX={BBOX}
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
  BBOX: PropTypes.arrayOf(PropTypes.number),
};

export default SidePanelContent;
