import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import {FILTER_BY} from '../config';
import {useTranslation} from 'react-i18next';

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

export const FilterByForm = ({institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange, dictionaries}) => {
  const {t} = useTranslation();


  const [selectedCategory, setSelectedCategory] = useState('');

  const translateLabels = (array, translationRoute) => {
    return array.map(el => ({
      ...el,
      id: el.id,
      label: t(`${translationRoute}.${el.id}`)
    }));
  };

  const categoryOptions = FILTER_BY.map((opt) => ({
    id: opt,
    label: t('fieldLabel.' + opt)
  }));

  const handleOnOptionChange = (id) => {
    if (!id) return;
    onInstitutionFilterChange(selectedCategory === 'institutioncode' ? id : undefined);
    onBasisOfRecordChange(selectedCategory === 'basisofrecord' ? id : undefined);
  };

  const institutionsOptions = useMemo(() => translateLabels(dictionaries.institutioncode, 'institutionLegend'), [dictionaries.institutioncode]);
  const basisOptions = useMemo(() => translateLabels(dictionaries.basisofrecord, 'basisofrecordLegend'), [dictionaries.basisofrecord]);

  const getOptions = () => {
    if (selectedCategory === 'institutioncode') {
      return institutionsOptions;
    } else if (selectedCategory === 'basisofrecord') {
      return basisOptions;
    } else {
      return [];
    }
  };

  return <>
    <SelectInput
      options={categoryOptions}
      selectedOptionId={selectedCategory}
      onOptionChange={setSelectedCategory}
      allowEmptyValue
      placeholderLabel={t('selectFilter')}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />
    <SelectInput
      options={getOptions()}
      selectedOptionId={(selectedCategory && selectedCategory === 'institution' ? institutionFilter : basisOfRecordFilter) || ''}
      onOptionChange={handleOnOptionChange}
      allowEmptyValue
      placeholderLabel={'-'}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />
  </>;
};

FilterByForm.propTypes = {
  institutionFilter: PropTypes.number,
  onInstitutionFilterChange: PropTypes.func.isRequired,
  basisOfRecordFilter: PropTypes.number,
  onBasisOfRecordChange: PropTypes.func.isRequired,
  dictionaries: PropTypes.object.isRequired,
};

export default FilterByForm;
