import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';
import useDictionaries from '../../hooks/useDictionaries';
import Typography from '@mui/material/Typography';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = () => {
  const dictionaries = useDictionaries();

  return <Stack sx={{height: '100%', overflow: 'hidden'}}>
    <ScrollableContent>
      {Object.entries(dictionaries).map(([key, values]) => <Typography key={key}>{`${key}: ${values.length}`}</Typography>)}
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

export default SidePanelContent;

