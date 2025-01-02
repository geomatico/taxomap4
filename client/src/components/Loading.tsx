import React, {FC} from 'react';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import {useTranslation} from 'react-i18next';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

export const Loading: FC  = () => {

  const {t} = useTranslation();

  return <Dialog open={true}>
    <DialogContent>
      <Paper sx={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center', width: '400px'}} elevation={0}>
        <Typography variant='overline' sx={{fontSize: 12}}>{t('loading')}</Typography>
        <Box sx={{width: '300px', mt: 1}}>
          <LinearProgress/>
        </Box>
      </Paper>
    </DialogContent>
  </Dialog>;
};

export default Loading;