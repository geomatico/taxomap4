import React, {FC} from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Logo from '../../components/icons/Logo';
import ResponsiveHeader from '@geomatico/geocomponents/Layout/ResponsiveHeader';
import Typography from '@mui/material/Typography';
import FileDropper from '../../components/FileDropper';
import {Grid, Skeleton} from '@mui/material';

//TYPES
export type AdminProps = {
    onUpload: (file: File) => void
};

const AdminPage: FC<AdminProps> = ({onUpload}) => {
  
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
      <Grid item sm={3}>
        <FileDropper onInput={file => onUpload(file)}/>
      </Grid>
      <Grid item sm={9}>
        <Skeleton variant='rectangular' height='90vh' sx={{borderRadius: 1}}/>
      </Grid>
    </Grid>

  </>;
};
export default AdminPage;