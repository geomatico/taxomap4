import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';
import PropTypes from 'prop-types';

import FilterByForm from '../../components/FilterByForm';
import TaxoTree from '../../components/TaxoTree';
import {TAXONOMIC_LEVELS} from '../../config';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: 0,
});

const SidePanelContent = ({institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange, yearFilter, selectedTaxon, onTaxonChange}) => {

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
      <TaxoTree
        institutionFilter={institutionFilter}
        basisOfRecordFilter={basisOfRecordFilter}
        yearFilter={yearFilter}
        selectedTaxon={selectedTaxon}
        onTaxonChanged={onTaxonChange}
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
  onTaxonChange: PropTypes.func.isRequired
};

export default SidePanelContent;
