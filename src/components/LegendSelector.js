import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import Box from '@mui/material/Box';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, PHYLUM_LEGEND} from '../config';

const selectStyles = {
  '& .SelectInput-select': {
    bgcolor: 'white',
    fontSize: '14px'
  }
};
export const LegendSelector = ({symbolizeBy, onSymbolizeByChange}) => {

  const {t} = useTranslation();

  const options = [
    {
      id: 'basisofrecord',
      label: t('fieldLabel.basisofrecord'),
      data: BASIS_OF_RECORD_LEGEND
    },
    {
      id: 'phylum',
      label: t('fieldLabel.phylum'),
      data: PHYLUM_LEGEND
    },
    {
      id: 'institutioncode',
      label: t('fieldLabel.institutioncode'),
      data: INSTITUTION_LEGEND
    }
  ];

  return <>
    <Box sx={{
      background: 'white',
      maxWidth: '200px',
      borderRadius: '3px',
      p: 1,
      mb: 1
    }}>
      { options
        .find(opt=> opt.id === symbolizeBy).data
        .map((cat) => (
          <Box key={cat.label} sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '10px'
          }}>
            <FiberManualRecordIcon sx={{
              color: cat.color,
              fontSize: '12px',
              mr: 1
            }}/>
            {cat.label}
          </Box>
        ))
      }
    </Box>
    <SelectInput
      options={options}
      selectedOptionId={symbolizeBy}
      onOptionChange={onSymbolizeByChange}
      sx={selectStyles}
    />
  </>;
};

LegendSelector.propTypes = {
  symbolizeBy: PropTypes.oneOf(['phylum', 'basisofrecord', 'institutioncode']).isRequired,
  onSymbolizeByChange: PropTypes.func.isRequired,
};

export default LegendSelector;
