import React, {useState} from 'react';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import Box from '@mui/material/Box';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, PHYLUM_LEGEND} from '../config';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PropTypes from 'prop-types';

const selectStyles = {
  '& .SelectInput-select': {
    bgcolor: 'white',
    fontSize: '14px'
  }
};
export const LegendSelector = ({symbolizeBy, onSymbolizeByChange}) => {

  const options = [
    {
      id: 'basisofrecord',
      label: 'Basis of Record',
      data: BASIS_OF_RECORD_LEGEND
    },
    {
      id: 'phylum',
      label: 'Phylum',
      data: PHYLUM_LEGEND
    },
    {
      id: 'institutioncode',
      label: 'Institución',
      data: INSTITUTION_LEGEND
    }
  ];

  const [selectedLegend, setSelectedLegend] = useState(options.find(leg => symbolizeBy === leg.id));

  const handleOnLegendChange = (id) => {
    onSymbolizeByChange(id);
    setSelectedLegend(options.find(el => el.id === id));
  };

  return <>
    <Box sx={{
      background: 'white',
      maxWidth: '200px',
      borderRadius: '3px',
      p: 1,
      mb: 1
    }}>
      {selectedLegend?.data.map((el) => (
        <Box key={el.label} sx={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '10px'
        }}>
          <FiberManualRecordIcon sx={{
            color: el.color,
            fontSize: '12px',
            mr: 1
          }}/>
          {el.label}
        </Box>
      ))
      }
    </Box>
    <SelectInput
      options={options}
      selectedOptionId={selectedLegend.id}
      onOptionChange={handleOnLegendChange}
      sx={selectStyles}
    />
  </>;
};

LegendSelector.propTypes = {
  symbolizeBy: PropTypes.oneOf(['phylum', 'basisofrecord', 'institutioncode']).isRequired,
  onSymbolizeByChange: PropTypes.func.isRequired,
};

export default LegendSelector;
