import React, {useState} from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import styled from '@mui/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';

//GEOCOMPONENTS
import ResponsiveHeader from '@geomatico/geocomponents/ResponsiveHeader';
import SidePanel from '@geomatico/geocomponents/SidePanel';

//UTILS
import Logo from './icons/Logo';
import {DRAWER_WIDTH, OFFSET_TOP, SM_BREAKPOINT} from '../config';
import {useTranslation} from 'react-i18next';

import AboutModal from './About/AboutModal';
import HelpModal from './HelpModal';
import Breadcrumbs from './Breadcrumbs';


const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'widescreen' && prop !== 'isleftdraweropen'
})(({widescreen, isleftdraweropen}) => ({
  flexGrow: 1,
  padding: 0,
  position: 'absolute',
  top: 56 + OFFSET_TOP,
  '@media (min-width: 0px) and (orientation: landscape)': {
    top: 48 + OFFSET_TOP
  },
  ['@media (min-width: '+ SM_BREAKPOINT +'px)']: {
    top: 64 + OFFSET_TOP
  },
  bottom: 0,
  right: 0,
  left: widescreen ? (isleftdraweropen && DRAWER_WIDTH) : 0
}));

const helperTextStyle = {
  mx: 1,
  color: 'text.secondary',
  textTransform: 'none',
  '&:hover': {
    color: 'text.contrastText'
  }
};

const Layout = ({mainContent, sidePanelContent}) => {
  const {t} = useTranslation();
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(true);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  const handleClose = () => setSidePanelOpen(!isSidePanelOpen);

  return <>
    <ResponsiveHeader
      title={<Breadcrumbs tree={['Eukaryota', 'Animalia', 'Chordata', 'Aves', 'Passeriformes']}/>}
      logo={
        <Link href="https://taxomap.bioexplora.cat/" target="_blank">
          <Box sx={{my: 1.5, ml: 2}}>
            <Logo/>
          </Box>
        </Link>
      }
      onStartIconClick={widescreen ? undefined : handleClose}
      isStartIconCloseable={isSidePanelOpen}
      sx={{'&.MuiAppBar-root': {zIndex: 1500}, top: OFFSET_TOP}}
    >
      <Button onClick={() => setAboutModalOpen(true)} sx={helperTextStyle}>{t('about')}</Button>
      <Button onClick={() => setHelpModalOpen(true)} sx={helperTextStyle}>{t('help')}</Button>
      <AboutModal onClose={() => setAboutModalOpen(false)} isAboutModalOpen={isAboutModalOpen}/>
      <HelpModal onClose={() => setHelpModalOpen(false)} isHelpModalOpen={isHelpModalOpen}/>

    </ResponsiveHeader>
    {
      sidePanelContent && isSidePanelOpen && <SidePanel
        drawerWidth={DRAWER_WIDTH + 'px'}
        anchor="left"
        isOpen={isSidePanelOpen}
        onClose={handleClose}
        widescreen={widescreen}
        sx={{
          '& .MuiPaper-root': {
            top: OFFSET_TOP + 56,
            '@media (min-width: 0px) and (orientation: landscape)': {
              top: 48 + OFFSET_TOP
            },
            ['@media (min-width: '+ SM_BREAKPOINT +'px)']: {
              top: 64 + OFFSET_TOP
            },
          }}}
      >
        {sidePanelContent}
      </SidePanel>
    }

    {/*
      El toString de widescreen y de isleftdraweropen soluciona el warning que da en la consola que dice:
      Received `true` for a non-boolean attribute `isleftdraweropen | widescreen`. If you want to write it
      to the DOM, pass a string instead: isleftdraweropen="true" or isleftdraweropen={value.toString()}.
     */}
    <Main widescreen={widescreen.toString()} isleftdraweropen={(sidePanelContent && isSidePanelOpen).toString()}>
      {mainContent}
    </Main>
  </>;
};

Layout.propTypes = {
  sidePanelContent: PropTypes.element.isRequired,
  mainContent: PropTypes.element.isRequired
};

export default Layout;
