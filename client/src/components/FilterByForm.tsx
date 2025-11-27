import React, {FC, useEffect, useState} from 'react';

import {useTranslation} from 'react-i18next';

import SelectInput from '@geomatico/geocomponents/Forms/SelectInput';
import NumericIdSelectInput from '@geomatico/geocomponents/Forms/NumericIdSelectInput';

import {FILTER_BY} from '../config';
import Box from '@mui/material/Box';
import useLegends from '../hooks/useLegends';
import {Lang} from '../commonTypes';

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

type FilterByFormProps = {
  institutionFilter?: number,
  onInstitutionFilterChange: (id?: number) => void,
  basisOfRecordFilter?: number,
  onBasisOfRecordChange: (id?: number) => void
}

export const FilterByForm: FC<FilterByFormProps> = ({
  institutionFilter, onInstitutionFilterChange,
  basisOfRecordFilter, onBasisOfRecordChange,
}) => {
  const {t, i18n: {language}} = useTranslation();
  const legends = useLegends(language as Lang);
  const [selectedField, setSelectedField] = useState<string>();

  useEffect(() => {
    onBasisOfRecordChange();
    onInstitutionFilterChange();
  }, [selectedField]);

  const fieldOptions = FILTER_BY.map(field => ({
    id: field,
    label: t(`fieldLabel.${field}`)
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
      options={legends.institutionlegend}
      selectedOptionId={institutionFilter}
      onOptionChange={onInstitutionFilterChange}
      allowEmptyValue
      placeholderLabel={'-'}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />}
    {selectedField === 'basisofrecord' && <NumericIdSelectInput
      options={legends.basisOfRecordLegend}
      selectedOptionId={basisOfRecordFilter}
      onOptionChange={onBasisOfRecordChange}
      allowEmptyValue
      placeholderLabel={'-'}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />}
  </Box>;
};

export default FilterByForm;
