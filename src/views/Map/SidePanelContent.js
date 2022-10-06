import React, {useMemo, useState} from 'react';
import SelectInput from '@geomatico/geocomponents/SelectInput';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';
import useDictionaries from '../../hooks/useDictionaries';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {CATEGORIES} from '../../config';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

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
    '&.MuiInputBase-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'steelblue'
      }
    }
  },
  '& .MuiSvgIcon-root': {
    color: 'steelblue'
  }
};

const SidePanelContent = ({institutionFilter, onInstitutionFilterChange, basisOfRecordFilter, onBasisOfRecordChange}) => {
  const dictionaries = useDictionaries();
  const {t} = useTranslation();

  const categoryOptions = CATEGORIES.map((opt) => ({
    id: opt,
    label: t('fieldLabel.' + opt)
  }));

  const [selectedCategory, setSelectedCategory] = useState(''); // empieza en '' y no en undefined por el SelectInput

  const translateLabels = (array, translationRoute) => {
    return array.map(el => ({
      ...el,
      id: el.id.toString(), // FIXME tenemos otra vez el mismo problema de que el select espera un id string, y estos ids son numbers, asi que hay que parsear de ida y vuelta
      label: t(`${translationRoute}.${el.id}`)
    }));
  };

  const handleOnOptionChange = (id) => {
    if (!id) return;
    onInstitutionFilterChange(selectedCategory === 'institution' ? id.toString() : undefined); // FIXME tenemos otra vez el mismo problema de que el select espera un id string, y estos ids son numbers, asi que hay que parsear de ida y vuelta
    onBasisOfRecordChange(selectedCategory === 'basisofrecord' ? id.toString() : undefined);
  };

  const institutionsOptions = useMemo(() => translateLabels(dictionaries.institutioncode, 'institutionLegend'), [dictionaries.institutioncode]);
  const basisOptions = useMemo(() => translateLabels(dictionaries.basisofrecord, 'basisofrecordLegend'), [dictionaries.basisofrecord]);

  const getOptions = () => {
    if (selectedCategory === 'institution') {
      return institutionsOptions;
    } else if (selectedCategory === 'basisofrecord') {
      return basisOptions;
    } else {
      return [];
    }
  };

  return <Stack sx={{
    height: '100%',
    overflow: 'hidden'
  }}>
    <ScrollableContent>
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
      {Object.entries(dictionaries).map(([key, values]) => <Typography
        key={key}>{`${key}: ${values.length}`}</Typography>)}
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  institutionFilter: PropTypes.string,
  onInstitutionFilterChange: PropTypes.func.isRequired,
  basisOfRecordFilter: PropTypes.string,
  onBasisOfRecordChange: PropTypes.func.isRequired,
};

export default SidePanelContent;

