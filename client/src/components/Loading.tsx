import React, {FC} from 'react';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import {useTranslation} from 'react-i18next';

export const Loading: FC  = () => {

  const {t} = useTranslation();

  return <Box sx={{height: '100vh', display: 'grid', placeItems: 'center'}}>
    <Paper sx={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center', p: 3, width: '400px'}} elevation={3}>
      <Typography variant='overline' sx={{fontSize: 12}}>{t('loading')}</Typography>
      <Box sx={{width: '300px', mt: 1}}>
        <LinearProgress/>
      </Box>
    </Paper>
  </Box>;
};

export default Loading;