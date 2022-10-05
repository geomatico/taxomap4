import React, {useState} from 'react';
import SelectInput from '@geomatico/geocomponents/SelectInput';
import Box from '@mui/material/Box';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, PHYLUM_LEGEND} from '../config';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const LegendSelector = () => {

  const options = [
    {id: 'BASIS_OF_RECORD_LEGEND', label: 'Basis of Record', data: BASIS_OF_RECORD_LEGEND},
    {id: 'PHYLUM_LEGEND', label: 'Phylum', data: PHYLUM_LEGEND },
    {id: 'INSTITUTION_LEGEND', label: 'Institución', data: INSTITUTION_LEGEND}
  ];

  const [selectedLegend, setSelectedLegend] = useState(options[2]);

  const handleOnLegendChange =(id)=> {
    setSelectedLegend(options.find(el=> el.id === id));
  };

  return <>
    <Box sx={{background: 'lightgray', maxWidth: '200px', borderRadius: '3px', p: 1}}>
      { selectedLegend?.data.map((el) => (
        <Box key={el.label} sx={{display: 'flex', alignItems: 'center', fontSize: '10px'}}>
          <FiberManualRecordIcon sx={{color: el.color, fontSize: '12px', mr: 1}}  />
          {el.label}
        </Box>
      ))
      }
    </Box>
    <SelectInput
      options={options}
      selectedOptionId={selectedLegend.id}
      onOptionChange={handleOnLegendChange}
    />
  </>;
};

export default LegendSelector;
