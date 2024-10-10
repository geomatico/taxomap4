import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import SelectInput from '@geomatico/geocomponents/Forms/SelectInput';
import Box from '@mui/material/Box';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, PHYLUM_LEGEND} from '../config';
import styled from '@mui/styles/styled';
import Typography from '@mui/material/Typography';

const LEGEND_WIDTH = '260px';

const selectStyles = {
  '& .SelectInput-select': {
    bgcolor: 'white',
    fontSize: '15px',
    width: LEGEND_WIDTH
  }
};

const menuSelectStyles = {
  '& .SelectInput-menuItem': {
    'fontSize': '12px',
    'color': 'black',
  },
  '& .SelectInput-placeholder': {
    'fontStyle': 'italic',
    'fontSize': '12px',
  }
};

const Legend = styled(Box)(({theme}) => ({
  width: LEGEND_WIDTH,
  backgroundColor: 'white',
  maxWidth: LEGEND_WIDTH,
  borderRadius: '3px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const LegendItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px'
});

const LegendIcon = ({color}) => <FiberManualRecordIcon sx={{
  fontSize: '12px',
  marginRight: 1,
  color: color
}}/>;
LegendIcon.propTypes = {color: PropTypes.string.isRequired};

export const LegendSelector = ({symbolizeBy, onSymbolizeByChange, children}) => {
  const {t} = useTranslation();

  const options = [
    {
      id: 'basisofrecord',
      label: t('fieldLabel.basisofrecord'),
      legend: BASIS_OF_RECORD_LEGEND.map(({id, color, labelKey}) => ({
        id,
        color,
        label: t(`basisofrecordLegend.${labelKey}`)
      }))
    },
    {
      id: 'phylum',
      label: t('fieldLabel.phylum'),
      legend: PHYLUM_LEGEND.map(({id, color, labelKey}) => ({
        id,
        color,
        label: t(`phylumLegend.${labelKey}`)
      }))
    },
    {
      id: 'institutioncode',
      label: t('fieldLabel.institutioncode'),
      legend: INSTITUTION_LEGEND.map(({id, color, labelKey}) => ({
        id,
        color,
        label: t(`institutionLegend.${labelKey}`)
      }))
    }
  ];

  const selectedLegend = options.find(option => option.id === symbolizeBy).legend;

  return <>
    {children}
    <Legend>
      {selectedLegend.map(({id, color, label}) =>
        <LegendItem key={id}>
          <LegendIcon color={color}/>
          <Typography variant='caption'>{label}</Typography>
        </LegendItem>
      )}
    </Legend>
    <SelectInput
      options={options}
      selectedOptionId={symbolizeBy}
      onOptionChange={onSymbolizeByChange}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />
  </>;
};

LegendSelector.propTypes = {
  symbolizeBy: PropTypes.oneOf(['phylum', 'basisofrecord', 'institutioncode']).isRequired,
  onSymbolizeByChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default LegendSelector;
