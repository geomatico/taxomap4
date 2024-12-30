import React, {FC} from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Logo from '../../components/icons/Logo';
import ResponsiveHeader from '@geomatico/geocomponents/Layout/ResponsiveHeader';
import Typography from '@mui/material/Typography';
import FileDropper from '../../components/FileDropper';
import Grid from '@mui/material/Grid';
import Loading from '../../components/Loading';
import TaxoTable, {Occurrency} from '../../components/TaxoTable';
import Alert from '../../components/Alert';

//TYPES
export type AdminProps = {
  data: Array<Occurrency>
  onUpload: (file: File) => void,
  isUploading: boolean
  success: boolean,
  onAlertAccept: () => void
};

const AdminPage: FC<AdminProps> = ({data, onUpload, isUploading, onAlertAccept, success}) => {
  return <>
    <ResponsiveHeader
      title=''
      logo={
        <Link href="/" target="_blank">
          <Box sx={{my: 1.5, ml: 2}}>
            <Logo width='195px'/>
          </Box>
        </Link>
      }
      sx={{'&.MuiAppBar-root': {zIndex: 1500}}}
    >
      <Typography>ADMIN</Typography>
    </ResponsiveHeader>
    <Grid container spacing={2} sx={{position: 'relative', top: 56, p: 2}}>
      <Grid item sm={2}>
        <FileDropper onInput={file => onUpload(file)}/>
      </Grid>
      <Grid item sm={10}>
        <TaxoTable data={data}/>
      </Grid>
    </Grid>
    {isUploading && <Loading message='uploading'/>}
    {success && <Alert isOpen={true} title='Subir csv' description='Su archivo se ha cargado con éxito' onAccept={onAlertAccept}/>}
  </>;
};
export default AdminPage;