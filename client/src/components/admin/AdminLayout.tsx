import React, {FC, ReactElement, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//GEOCOMPONENTS
import SidePanel from '@geomatico/geocomponents/Layout/SidePanel';

//UTILS
import {DRAWER_WIDTH, OFFSET_TOP, SM_BREAKPOINT} from '../../config';

import MainHeader from '../MainHeader';

export type MainProps = {
  widescreen: boolean,
  isleftdraweropen: boolean
}

const Main = styled(Box,
  {
    shouldForwardProp: (prop) => prop !== 'widescreen' && prop !== 'isleftdraweropen' && prop !== 'isTactile'
  })<MainProps>(({widescreen, isleftdraweropen}) => ({
    flexGrow: 1,
    padding: 0,
    position: 'absolute',
    top: OFFSET_TOP,
    '@media (min-width: 0px) and (orientation: landscape)': {
      top: OFFSET_TOP
    },
    ['@media (min-width: ' + SM_BREAKPOINT + 'px)']: {
      top: OFFSET_TOP,
    },
    bottom: 0,
    right: 0,
    left: widescreen ? +(isleftdraweropen && DRAWER_WIDTH) : 0
  }));

type Props = {
  sidePanelContent: ReactElement,
  mainContent:  ReactElement
}

const AdminLayout: FC<Props> = ({mainContent, sidePanelContent}) => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(true);

  const sidePanelSx = {
    '& .MuiPaper-root': {
      padding: 0,
      top: OFFSET_TOP,
      '@media (min-width: 0px) and (orientation: landscape)': {
        top: OFFSET_TOP
      },
      ['@media (min-width: ' + SM_BREAKPOINT + 'px)']: {
        top: OFFSET_TOP
      },
    }
  };
  
  const handleClose = () => setSidePanelOpen(!isSidePanelOpen);

  return <>
    <MainHeader/>
    {
      sidePanelContent && isSidePanelOpen && <SidePanel
        drawerWidth={DRAWER_WIDTH + 'px'}
        anchor="left"
        isOpen={isSidePanelOpen}
        onClose={handleClose}
        widescreen={widescreen}
        sx={sidePanelSx}
      >
        {sidePanelContent}
      </SidePanel>
    }
    <Main widescreen={widescreen} isleftdraweropen={(sidePanelContent && isSidePanelOpen)}>
      {mainContent}
    </Main>
  </>;
};

export default AdminLayout;
