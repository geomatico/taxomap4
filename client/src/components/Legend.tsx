import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {BASIS_OF_RECORD_LEGEND, INSTITUTION_LEGEND, PHYLUM_LEGEND} from '../config';
import {SxProps} from '@mui/system';
import Box from '@mui/material/Box';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Typography from '@mui/material/Typography';
import SelectInput from '@geomatico/geocomponents/Forms/SelectInput';
import GraphicByLegend from './GraphicByLegend';
import {Filters, MapType, SymbolizeBy} from '../commonTypes';

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
type LegendItem = {
  id: number,
  color: `#${string}`
  label: string
};

type OptionLegend = {
  id: SymbolizeBy,
  label: string,
  legend: Array<LegendItem> | undefined
};

type OptionMapType = {
  id: MapType,
  label: string
};

export type LegendProps = {
  symbolizeBy: SymbolizeBy,
  filters: Filters,
  selectedMapType: MapType,
  onSymbolizeByChange: (symbolizeBy: SymbolizeBy) => void,
  onMapTypeChange: (mapType: MapType) => void
};

const Legend: FC<LegendProps> = ({symbolizeBy, selectedMapType, filters, onSymbolizeByChange, onMapTypeChange}) => {
  const {t} = useTranslation();

  const symbolizationOptions: Array<OptionLegend> = [
    {
      id: SymbolizeBy.basisofrecord,
      label: t('fieldLabel.basisofrecord'),
      legend: BASIS_OF_RECORD_LEGEND.map(({id, color, labelKey}) => ({
        id,
        color,
        label: t(`basisofrecordLegend.${labelKey}`)
      }))
    },
    {
      id: SymbolizeBy.phylum,
      label: t('fieldLabel.phylum'),
      legend: PHYLUM_LEGEND.map(({id, color, labelKey}) => ({
        id,
        color,
        label: t(`phylumLegend.${labelKey}`)
      }))
    },
    {
      id: SymbolizeBy.institutioncode,
      label: t('fieldLabel.institutioncode'),
      legend: INSTITUTION_LEGEND.map(({id, color, labelKey}) => ({
        id,
        color,
        label: t(`institutionLegend.${labelKey}`)
      }))
    }
  ];
  
  const mapTypeOptions: Array<OptionMapType> = [
    {
      id: MapType.discreteData,
      label: t('mapTypes.discreteData')
    },
    {
      id: MapType.heatMap,
      label: t('mapTypes.heatMap')
    },
    {
      id: MapType.aggregateData,
      label: t('mapTypes.aggregateData')
    }
  ];

  const selectedLegend = symbolizationOptions.find(option => option.id === symbolizeBy)?.legend;

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