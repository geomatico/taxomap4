import React, {FC, ReactElement, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import {styled} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//GEOCOMPONENTS
import ResponsiveHeader from '@geomatico/geocomponents/Layout/ResponsiveHeader';
import SidePanel from '@geomatico/geocomponents/Layout/SidePanel';

//UTILS
import Logo from './icons/Logo';
import {DRAWER_WIDTH, OFFSET_TOP, SM_BREAKPOINT} from '../config';
import {useTranslation} from 'react-i18next';

import AboutModal from './About/AboutModal';
import HelpModal from './HelpModal';
import Breadcrumbs from './Breadcrumbs';
import useTaxonPath from '../hooks/useTaxonPath';
import useDictionaries from '../hooks/useDictionaries';
import {Taxon, TaxonomicLevel} from '../commonTypes';
import MainHeader from './MainHeader';

export type MainProps = {
  widescreen: boolean,
  isTactile: boolean,
  isleftdraweropen: boolean
}

const Main = styled(Box,
  {shouldForwardProp: (prop) => prop !== 'widescreen' && prop !== 'isleftdraweropen' && prop !== 'isTactile'
  })<MainProps>(({widescreen, isTactile, isleftdraweropen}) => ({
    flexGrow: 1,
    padding: 0,
    position: 'absolute',
    top: isTactile ? 56 : 56 + OFFSET_TOP,
    '@media (min-width: 0px) and (orientation: landscape)': {
      top: isTactile ? 48 : 48 + OFFSET_TOP
    },
    ['@media (min-width: '+ SM_BREAKPOINT +'px)']: {
      top: isTactile ? 64 : 64 + OFFSET_TOP,
    },
    bottom: 0,
    right: 0,
    left: widescreen ? +(isleftdraweropen && DRAWER_WIDTH) : 0
  }));

const helperTextStyle = {
  mx: 1,
  color: 'text.secondary',
  textTransform: 'none',
  '&:hover': {
    color: 'text.contrastText'
  }
};



export type LayoutProps = {
  sidePanelContent: ReactElement,
  mainContent:  ReactElement,
  selectedTaxon: {
    level: TaxonomicLevel,
    id: number
  },
  isTactile: boolean,
  onTaxonChange: (taxon: Taxon) => void
}

const Layout: FC<LayoutProps> = ({mainContent, sidePanelContent, selectedTaxon, isTactile, onTaxonChange}) => {
  const {t} = useTranslation();
  const dictionaries = useDictionaries();
  const taxonPath = useTaxonPath(selectedTaxon, dictionaries);

  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(true);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  const sidePanelSx = {
    '& .MuiPaper-root': {
      padding: 0,
      top: isTactile ? 56 : OFFSET_TOP + 56,
      '@media (min-width: 0px) and (orientation: landscape)': {
        top: isTactile ? 48 : 48 + OFFSET_TOP
      },
      ['@media (min-width: ' + SM_BREAKPOINT + 'px)']: {
        top: isTactile ? 64 : 64 + OFFSET_TOP
      },
    }
  };
  
  const handleClose = () => setSidePanelOpen(!isSidePanelOpen);

  return <>
    {!isTactile && <MainHeader/>}
    <ResponsiveHeader
      title={<Breadcrumbs tree={taxonPath} onTaxonChange={onTaxonChange}/>}
      logo={
        <Link href={isTactile ? '/#/planetavida' : '/#/map'} target="_blank">
          <Box sx={{my: 1.5, ml: 2}}>
            <Logo width='195px'/>
          </Box>
        </Link>
      }
      onStartIconClick={widescreen ? undefined : handleClose}
      isStartIconCloseable={isSidePanelOpen}
      sx={{'&.MuiAppBar-root': {zIndex: 1500}, top: isTactile ? 0 : OFFSET_TOP}}
    >
      {!isTactile && <Button onClick={() => setAboutModalOpen(true)} sx={helperTextStyle}>{t('about')}</Button>}
      {!isTactile && <Button onClick={() => setHelpModalOpen(true)} sx={helperTextStyle}>{t('help')}</Button>}
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
        sx={sidePanelSx}
      >
        {sidePanelContent}
      </SidePanel>
    }
    <Main widescreen={widescreen} isTactile={isTactile} isleftdraweropen={(sidePanelContent && isSidePanelOpen)}>
      {mainContent}
    </Main>
  </>;
};

export default Layout;
