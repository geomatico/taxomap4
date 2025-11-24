import React, {FC} from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import {lighten} from '@mui/material/styles';
import {grey} from '@mui/material/colors';
import {DataGrid, esES, GridRenderCellParams} from '@mui/x-data-grid';

import {INSTITUTION_COLOR} from '../config';
import {InstitutionCode, Occurrence} from '../commonTypes';

const renderInstitution = (params: GridRenderCellParams<Occurrence, InstitutionCode>) => {
  if (params.value) {
    const chipColor = INSTITUTION_COLOR[params.value] || '#d3d3d3';
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
      valueFormatter: (params: { value?: Date }) => params?.value ? params.value.toLocaleDateString('en-GB') : undefined, // en-GB uses DD/MM/YYYY with zero padding
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
      localeText={{
        ...esES.components.MuiDataGrid.defaultProps.localeText, // Extiende las traducciones en español
        noRowsLabel: 'Sin Ocurrencias', // Sobrescribe el texto para filas vacías
      }}
      //hideFooter
      getRowId={params => params.id}
    />
  </Box>;
};
export default TaxoTable;