import React, {FC} from 'react';

import {DataGrid, esES, GridRenderCellParams} from '@mui/x-data-grid';
import {Chip, lighten} from '@mui/material';
import {INSTITUTION_COLOR} from '../config';
import Box from '@mui/material/Box';
import {grey} from '@mui/material/colors';

//TYPES
export type Occurrency = {
  catalogNumber: string,
  institutionCode: string,
  basisOfRecord: string,
  scientificName: string,
  kingdom: string,
  phylum: string,
  class: string,
  order: string,
  family: string,
  genus: string,
  specificepithet: string,
}

export type TaxoTableProps = {
   data: Array<Occurrency>
};

const TaxoTable: FC<TaxoTableProps> = ({data}) => {
  
  const renderInstitution = (params: GridRenderCellParams) => {
    const chipColor = grey[700];
    //const chipColor = INSTITUTION_COLOR.filter(i => i.id === params.value)[0].color || '#fabada';
    return <Chip label={params.value} variant="outlined" sx={{color: chipColor, borderColor: chipColor, bgcolor: lighten(chipColor, 0.75), fontSize: 12}}/>;
  };
  const columns = [
    {
      field: 'catalogNumber',
      headerName: 'Nº CATÁLOGO',
      width: 160,
    },
    {
      field: 'institutionCode',
      headerName: 'INSTITUCIÓN',
      width: 130,
      renderCell: renderInstitution
    },
    {
      field: 'basisOfRecord',
      headerName: 'BASIS OF RECORD',
      width: 200,
    },
    {
      field: 'scientificName',
      headerName: 'NOMBRE CIENTÍFICO',
      width: 250,
    },
    {
      field: 'kingdom',
      headerName: 'KINGDOM',
      width: 100,
    },
    {
      field: 'phylum',
      headerName: 'PHYLUM',
      width: 100,
    },
    {
      field: 'class',
      headerName: 'CLASS',
      width: 100,
    },
    {
      field: 'order',
      headerName: 'ORDER',
      width: 150,
    },
    {
      field: 'family',
      headerName: 'FAMILY',
      width: 150,
    },
    {
      field: 'specificepithet',
      headerName: 'SPECIFICE PITHET',
      width: 200,
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
          textTransform: 'uppercase'
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
      getRowId={params => params.catalogNumber}
    />
  </Box>;
};
export default TaxoTable;