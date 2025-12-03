import React, {FC} from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import {lighten} from '@mui/material/styles';
import {grey} from '@mui/material/colors';
import {DataGrid, esES, enUS, GridRenderCellParams} from '@mui/x-data-grid';
import {caEs} from './x-data-grid-extra-locales';

import {LEGEND_FILTER_COLOR} from '../../config';
import {InstitutionCode, Occurrence} from '../../commonTypes';
import {useTranslation} from 'react-i18next';

const renderInstitution = (params: GridRenderCellParams<Occurrence, InstitutionCode>) => {
  if (params.value) {
    const chipColor = LEGEND_FILTER_COLOR[params.value] || '#d3d3d3';
    return <Chip
      label={params.value}
      variant='outlined'
      sx={{color: grey[700], borderColor: chipColor, bgcolor: lighten(chipColor, 0.75), fontSize: 12, textTransform: 'uppercase'}}
    />;
  }
};


type Props = {
   data: Array<Occurrence>
};

const TaxoTable: FC<Props> = ({data}) => {
  const {t, i18n: {language}} = useTranslation();

  const columns = [
    {
      field: 'id',
      headerName: 'id',
      width: 80
    },
    {
      field: 'institutionCode',
      headerName: 'institutionCode',
      width: 120,
      renderCell: renderInstitution
    },
    {
      field: 'collectionCode',
      headerName: 'collectionCode',
      width: 150
    },
    {
      field: 'catalogNumber',
      headerName: 'catalogNumber',
      width: 150,
    },
    {
      field: 'basisOfRecord',
      headerName: 'basisOfRecord',
      width: 150,
    },
    {
      field: 'taxonID',
      headerName: 'taxonID',
      width: 100
    },
    {
      field: 'decimalLatitude',
      headerName: 'decimalLatitude',
      width: 150
    },
    {
      field: 'decimalLongitude',
      headerName: 'decimalLongitude',
      width: 150
    },
    {
      field: 'eventDate',
      headerName: 'eventDate',
      width: 150,
      valueFormatter: ({value}: {value?: Date}) => value ? value.toISOString().split('T')[0] : undefined,
    },
    {
      field: 'countryCode',
      headerName: 'countryCode',
      width: 100
    },
    {
      field: 'stateProvince',
      headerName: 'stateProvince',
      width: 150
    },
    {
      field: 'county',
      headerName: 'county',
      width: 150
    },
    {
      field: 'municipality',
      headerName: 'municipality',
      width: 180
    },
    {
      field: 'georeferenceVerificationStatus',
      headerName: 'georeferenceVerificationStatus',
      width: 150
    },
    {
      field: 'identificationVerificationStatus',
      headerName: 'identificationVerificationStatus',
      width: 150
    }
  ];

  const localeText = {
    ...(language == 'es' ? esES.components.MuiDataGrid.defaultProps.localeText :
      language === 'en' ? enUS.components.MuiDataGrid.defaultProps.localeText :
        caEs.components.MuiDataGrid.defaultProps.localeText),
    noRowsLabel: t('admin.noRows')
  };

  return <Box sx={{height: '90vh'}}>
    <DataGrid
      sx={{
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'secondary.main',
          color: 'common.black',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold'
        },
        '& .MuiDataGrid-columnSeparator': {
          color: 'secondary.main',
        },
        '& .MuiButtonBase-root': {
          color: 'common.white'
        },
      }}
      rows={data}
      columns={columns}
      autoHeight={false}
      localeText={localeText}
      //hideFooter
      getRowId={params => params.id}
    />
  </Box>;
};

export default TaxoTable;