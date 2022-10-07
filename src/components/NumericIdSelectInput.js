import React from 'react';
import PropTypes from 'prop-types';

import SelectInput from '@geomatico/geocomponents/SelectInput';

const NumericIdSelectInput = ({options, selectedOptionId, onOptionChange, ...other}) => {

  const asString = value => value === undefined ? '' : value.toString();
  const asNumber = value => value === '' ? undefined : Number(value);

  return <SelectInput
    options={options.map(({id, label}) => ({id: asString(id), label}))}
    selectedOptionId={asString(selectedOptionId)}
    onOptionChange={v => onOptionChange(asNumber(v))}
    {...other}
  />;
};

NumericIdSelectInput.propTypes = {
  ...SelectInput.propTypes,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  selectedOptionId: PropTypes.number,
  onOptionChange: PropTypes.func.isRequired
};

NumericIdSelectInput.defaultProps = {
  ...SelectInput.defaultProps
};

export default NumericIdSelectInput;