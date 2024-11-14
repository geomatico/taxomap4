import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import SelectInput from '@geomatico/geocomponents/Forms/SelectInput';
import NumericIdSelectInput from '@geomatico/geocomponents/Forms/NumericIdSelectInput';

import {BASIS_OF_RECORD_LEGEND, FILTER_BY, INSTITUTION_LEGEND} from '../config';
import Box from '@mui/material/Box';

const menuSelectStyles = {
  '& .SelectInput-menuItem': {
    'fontSize': '14px',
    'color': 'black',
  },
  '& .SelectInput-placeholder': {
    'fontStyle': 'italic',
    'fontSize': '14px',
  }
};

const selectStyles = {
  '&.SelectInput-root': {
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'blue',
    },
    mt: 1,
    width: '260px',
    fontSize: '12px',
    '& .MuiTypography-body1': {
      fontSize: '14px'
    }
  },
  '& .SelectInput-select': {
    fontSize: '14px',
  }
};

export const FilterByForm = ({institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange}) => {
  const {t} = useTranslation();

  const [selectedField, setSelectedField] = useState('');

  useEffect(() => {
    onBasisOfRecordChange();
    onInstitutionFilterChange();
  }, [selectedField]);

  const fieldOptions = FILTER_BY.map(field => ({
    id: field,
    label: t(`fieldLabel.${field}`)
  }));

  const institutionOptions = INSTITUTION_LEGEND.map(({id, labelKey}) => ({
    id,
    label: t(`institutionLegend.${labelKey}`)
  }));

  const basisOfRecordOptions = BASIS_OF_RECORD_LEGEND.map(({id, labelKey}) => ({
    id,
    label: t(`basisofrecordLegend.${labelKey}`)
  }));

  return <Box p={2}>
    <SelectInput
      options={fieldOptions}
      selectedOptionId={selectedField}
      onOptionChange={setSelectedField}
      allowEmptyValue
      placeholderLabel={t('selectFilter')}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />
    {selectedField === 'institutioncode' && <NumericIdSelectInput
      options={institutionOptions}
      selectedOptionId={institutionFilter}
      onOptionChange={onInstitutionFilterChange}
      allowEmptyValue
      placeholderLabel={'-'}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />}
    {selectedField === 'basisofrecord' && <NumericIdSelectInput
      options={basisOfRecordOptions}
      selectedOptionId={basisOfRecordFilter}
      onOptionChange={onBasisOfRecordChange}
      allowEmptyValue
      placeholderLabel={'-'}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />}
  </Box>;
};

FilterByForm.propTypes = {
  institutionFilter: PropTypes.number,
  onInstitutionFilterChange: PropTypes.func.isRequired,
  basisOfRecordFilter: PropTypes.number,
  onBasisOfRecordChange: PropTypes.func.isRequired
};

export default FilterByForm;
