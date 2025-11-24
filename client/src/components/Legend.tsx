import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {SxProps} from '@mui/system';
import Box from '@mui/material/Box';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Typography from '@mui/material/Typography';
import SelectInput from '@geomatico/geocomponents/Forms/SelectInput';
import GraphicByLegend from './GraphicByLegend';
import {Filters, Legend as LegendType, MapType, SymbolizeBy} from '../commonTypes';
import useLegends from '../hooks/useLegends';

//STYLES
const LEGEND_WIDTH = '280px';

const container: SxProps = {
  width: LEGEND_WIDTH,
  maxWidth: LEGEND_WIDTH,
  borderRadius: '3px',
  p: 1,
  mb: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1
};

const legend: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 0.5,
  bgcolor: 'white',
  width: LEGEND_WIDTH,
  p: 1
};

const legendItem: SxProps = {
  display: 'flex',
  alignItems: 'center',
};

const selectStyles = {
  '&.SelectInput-root': {
    bgcolor: 'transparent'
  },
  '& .SelectInput-select': {
    bgcolor: 'white',
    //fontSize: '15px',
    width: LEGEND_WIDTH
  }
};

const menuSelectStyles = {
  '& .SelectInput-menuItem': {
    fontSize: '14px',
    color: 'black',
  },
  '& .SelectInput-placeholder': {
    fontStyle: 'italic',
    fontSize: '14px',
  }
};

//TYPES
type OptionMapType = {
  id: MapType,
  label: string
};

type Props = {
  symbolizeBy: SymbolizeBy,
  filters: Filters,
  selectedMapType: MapType,
  onSymbolizeByChange: (symbolizeBy: SymbolizeBy) => void,
  onMapTypeChange: (mapType: MapType) => void
};

const Legend: FC<Props> = ({symbolizeBy, selectedMapType, filters, onSymbolizeByChange, onMapTypeChange}) => {
  const {t} = useTranslation();
  const legends = useLegends();

  const translateLegend = (legend: LegendType) => legend.map(({id, color, labelKey}) => ({
    id,
    color,
    label: t(labelKey)
  }));

  const symbolizationOptions = [{
    id: 'basisofrecord',
    label: t('fieldLabel.basisofrecord'),
    legend: translateLegend(legends.basisOfRecordLegend)
  }, {
    id: 'phylum',
    label: t('fieldLabel.phylum'),
    legend: translateLegend(legends.phylumLegend)
  }, {
    id: 'institutioncode',
    label: t('fieldLabel.institutioncode'),
    legend: translateLegend(legends.institutionlegend)
  }];

  const mapTypeOptions: Array<OptionMapType> = [{
    id: MapType.discreteData,
    label: t('mapTypes.discreteData')
  }, {
    id: MapType.densityMap,
    label: t('mapTypes.densityMap')
  }];

  const selectedLegend = symbolizationOptions.find(option => option.id === symbolizeBy)?.legend || [];

  return <Box sx={container}>
    {
      selectedMapType === MapType.discreteData && <>
        <GraphicByLegend filters={filters} symbolizeBy={symbolizeBy}/>
        <Box sx={legend}>
          {
            selectedLegend && selectedLegend.map(({id, color, label}) =>
              <Box sx={legendItem} key={id}>
                <FiberManualRecordIcon sx={{mr: 1, color: color, fontSize: 14}}/>
                <Typography variant="body2">{label}</Typography>
              </Box>)
          }
        </Box>
        <SelectInput
          options={symbolizationOptions}
          selectedOptionId={symbolizeBy}
          onOptionChange={(option) => option && onSymbolizeByChange(option as SymbolizeBy)}
          sx={selectStyles}
          menuSx={menuSelectStyles}
        />
      </>
    }
    <SelectInput
      options={mapTypeOptions}
      selectedOptionId={selectedMapType}
      onOptionChange={(option) => option && onMapTypeChange(option as MapType)}
      sx={selectStyles}
      menuSx={menuSelectStyles}
    />
  </Box>;
};
export default Legend;