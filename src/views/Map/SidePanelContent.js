import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = () => {

  return <Stack sx={{height: '100%', overflow: 'hidden'}}>
    <ScrollableContent>
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

export default SidePanelContent;

