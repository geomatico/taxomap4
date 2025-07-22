import React, {FC, useEffect, useState} from 'react';

import {useTranslation} from 'react-i18next';

import SelectInput from '@geomatico/geocomponents/Forms/SelectInput';
import NumericIdSelectInput from '@geomatico/geocomponents/Forms/NumericIdSelectInput';

import {FILTER_BY} from '../config';
import Box from '@mui/material/Box';
import useLegends from '../hooks/useLegends';

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
  const {t} = useTranslation();
  const legends = useLegends();
  const [selectedField, setSelectedField] = useState<string>();

  useEffect(() => {
    onBasisOfRecordChange();
    onInstitutionFilterChange();
  }, [selectedField]);

  const fieldOptions = FILTER_BY.map(field => ({
    id: field,
    label: t(`fieldLabel.${field}`)
  }));

  const institutionOptions = legends.institutionlegend.map(({id, labelKey}) => ({
    id,
    label: t(labelKey)
  }));

  const basisOfRecordOptions = legends.basisOfRecordLegend.map(({id, labelKey}) => ({
    id,
    label: t(labelKey)
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

export default FilterByForm;
