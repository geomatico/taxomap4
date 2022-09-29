import React, {useState} from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import styled from '@mui/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';

//GEOCOMPONENTS
import ResponsiveHeader from '@geomatico/geocomponents/ResponsiveHeader';
import SidePanel from '@geomatico/geocomponents/SidePanel';

//UTILS
import Logo from './icons/Logo';
import { DRAWER_WIDTH, SM_BREAKPOINT } from '../config';

const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'widescreen' && prop !== 'isLeftDrawerOpen'
})(({widescreen, isLeftDrawerOpen}) => ({
  flexGrow: 1,
  padding: 0,
  position: 'absolute',
  top: 56,
  '@media (min-width: 0px) and (orientation: landscape)': {
    top: 48
  },
  ['@media (min-width: '+ SM_BREAKPOINT +'px)']: {
    top: 64
  },
  bottom: 0,
  right: 0,
  left: widescreen ? (isLeftDrawerOpen && DRAWER_WIDTH) : 0
}));

const helperTextStyle = {
  mx: 1,
  color: 'text.secondary',
  '&:hover': {
    color: 'text.contrastText'
  }
};

const Layout = ({mainContent, sidePanelContent}) => {

  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const handleClose = () => setIsSidePanelOpen(!isSidePanelOpen);

  return (
    <>
      <ResponsiveHeader
        title=''
        logo={
          <Link href="https://taxomap.bioexplora.cat/" target="_blank">
            <Box sx={{my: 1.5, ml: 2}}>
              <Logo/>
            </Box>
          </Link>
        }
        onStartIconClick={widescreen ? undefined : handleClose}
        isStartIconCloseable={isSidePanelOpen}
        sx={{'&.MuiAppBar-root': {zIndex: 1500}}}
      >
        <Typography variant='subtitle2' sx={helperTextStyle}>About</Typography>
        <Typography variant='subtitle2' sx={helperTextStyle}>Help</Typography>
      </ResponsiveHeader>
      {
        sidePanelContent && isSidePanelOpen && <SidePanel
          drawerWidth={DRAWER_WIDTH + 'px'}
          anchor="left"
          isOpen={isSidePanelOpen}
          onClose={handleClose}
          widescreen={widescreen}
          /*sx={{'& .MuiPaper-root': {left: widescreen ? MINI_SIDE_PANEL_WIDTH : MINI_SIDE_PANEL_DENSE_WIDTH}}}*/
        >
          {sidePanelContent}
        </SidePanel>
      }
      <Main widescreen={widescreen} isLeftDrawerOpen={sidePanelContent && isSidePanelOpen}>
        {mainContent}
      </Main>
    </>
  );
};

Layout.propTypes = {
  sidePanelContent: PropTypes.element.isRequired,
  mainContent: PropTypes.element.isRequired,
  miniSidePanelSelectedActionId: PropTypes.string.isRequired,
};

Layout.defaultProps = {
  miniSidePanelSelectedActionId: 'mapView',
};

export default Layout;
