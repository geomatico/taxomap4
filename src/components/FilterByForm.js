import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import SelectInput from '@geomatico/geocomponents/SelectInput';

import {FILTER_BY} from '../config';
import useDictionaries from '../hooks/useDictionaries';
import NumericIdSelectInput from './NumericIdSelectInput'; // TODO import from @geomatico/geocomponents instead when v.2.0.9 is published

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

const selectStyles = {
  '&.SelectInput-root': {
    mt: 1,
    width: '260px',
    fontSize: '12px',
    '& .MuiTypography-body1': {
      fontSize: '12px'
    }
  },
  '& .SelectInput-select': {
    fontSize: '12px',
  }
};

export const FilterByForm = ({institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange}) => {
  const dictionaries = useDictionaries();
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

  const institutionOptions = dictionaries.institutioncode.map(({id}) => ({
    id,
    label: t(`institutionLegend.${id}`)
  }));

  const basisOfRecordOptions = dictionaries.basisofrecord.map(({id}) => ({
    id,
    label: t(`basisofrecordLegend.${id}`)
  }));

  return <>
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
  </>;
};

FilterByForm.propTypes = {
  institutionFilter: PropTypes.number,
  onInstitutionFilterChange: PropTypes.func.isRequired,
  basisOfRecordFilter: PropTypes.number,
  onBasisOfRecordChange: PropTypes.func.isRequired
};

export default FilterByForm;
