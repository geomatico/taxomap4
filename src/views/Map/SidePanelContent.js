import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';
import useDictionaries from '../../hooks/useDictionaries';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import FilterByForm from '../../components/FilterByForm';
import TaxoTree from '../../components/TaxoTree';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange}) => {

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
      <TaxoTree/>


    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  institutionFilter: PropTypes.number,
  onInstitutionFilterChange: PropTypes.func.isRequired,
  basisOfRecordFilter: PropTypes.number,
  onBasisOfRecordChange: PropTypes.func.isRequired,
};

export default SidePanelContent;

