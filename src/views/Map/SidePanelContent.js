import React, {useEffect, useState} from 'react';
import SelectInput from '@geomatico/geocomponents/SelectInput';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';
import useDictionaries from '../../hooks/useDictionaries';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND} from '../../config';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({
                            institutionFilter,
                            onInstitutionFilterChange,
                            basisOfRecordFilter,
                            onBasisOfRecordChange
                          }) => {
  const dictionaries = useDictionaries();

  const options = [{
    id: 1,
    label: 'Institució'
  }, {
    id: 2,
    label: 'Tipus de registre'
  }];


  const [selectedFilter, setSelectedFilter] = useState();
  const [secondOptions, setSecondOptions] = useState([]);

  useEffect(() => {
    if (selectedFilter) {
      const options = selectedFilter === 1 ? INSTITUTION_LEGEND : BASIS_OF_RECORD_LEGEND;
      setSecondOptions(options);
    }
  }, [selectedFilter]);

  return <Stack sx={{
    height: '100%',
    overflow: 'hidden'
  }}>
    <ScrollableContent>
      <Box>
        <SelectInput
          options={options}
          selectedOptionId={institutionFilter}
          onOptionChange={setSelectedFilter}
          placeholderLabel={'pùeba'}
        />
        <SelectInput
          options={secondOptions}
          selectedOptionId={institutionFilter}
          onOptionChange={onInstitutionFilterChange}
          placeholderLabel={'pùeba'}
        />
      </Box>
      {Object.entries(dictionaries).map(([key, values]) => <Typography
        key={key}>{`${key}: ${values.length}`}</Typography>)}
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  institutionFilter: PropTypes.string.isRequired,
  onInstitutionFilterChange: PropTypes.func.isRequired,
  basisOfRecordFilter: PropTypes.string.isRequired,
  onBasisOfRecordChange: PropTypes.func.isRequired,
};

export default SidePanelContent;

