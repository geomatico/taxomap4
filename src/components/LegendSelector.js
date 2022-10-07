import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import Box from '@mui/material/Box';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, PHYLUM_LEGEND} from '../config';
import styled from '@mui/styles/styled';

const selectStyles = {
  '& .SelectInput-select': {
    bgcolor: 'white',
    fontSize: '14px',
    width: '220px'
  }
};

const Legend = styled(Box)(({theme}) => ({
  backgroundColor: 'white',
  maxWidth: '220px',
  borderRadius: '3px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const LegendItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  fontSize: '10px'
});

const LegendIcon = ({color}) => <FiberManualRecordIcon sx={{
  fontSize: '12px',
  marginRight: 1,
  color: color
}}/>;
LegendIcon.propTypes = {color: PropTypes.string.isRequired};

export const LegendSelector = ({symbolizeBy, onSymbolizeByChange}) => {
  const {t} = useTranslation();

  const options = [
    {
      id: 'basisofrecord',
      label: t('fieldLabel.basisofrecord'),
      legend: BASIS_OF_RECORD_LEGEND.map(({id, color}) => ({
        id,
        color,
        label: t(`basisofrecordLegend.${id}`)
      }))
    },
    {
      id: 'phylum',
      label: t('fieldLabel.phylum'),
      legend: PHYLUM_LEGEND.map(({id, color}) => ({
        id,
        color,
        label: t(`phylumLegend.${id}`)
      }))
    },
    {
      id: 'institutioncode',
      label: t('fieldLabel.institutioncode'),
      legend: INSTITUTION_LEGEND.map(({id, color}) => ({
        id,
        color,
        label: t(`institutionLegend.${id}`)
      }))
    }
  ];

  const selectedLegend = options.find(option => option.id === symbolizeBy).legend;

  return <>
    <Legend>
      {selectedLegend.map(({id, color, label}) =>
        <LegendItem key={id}>
          <LegendIcon color={color}/>
          {label}
        </LegendItem>
      )}
    </Legend>
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
