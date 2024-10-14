import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';

import AboutEn from './AboutEn';
import AboutEs from './AboutEs';
import AboutCa from './AboutCa';
import {useTranslation} from 'react-i18next';

const ABOUT = {
  'en': AboutEn,
  'es': AboutEs,
  'ca': AboutCa
};

const AboutModal = ({isAboutModalOpen, onClose}) => {
  const {i18n} = useTranslation();
  const activeLang = i18n.resolvedLanguage;
  const LocalizedAbout = ABOUT[activeLang];

  return <Dialog
    onClose={onClose}
    open={isAboutModalOpen}
    maxWidth='md'
    sx={{zIndex: 2000}}
  >
    <DialogContentText sx={{p: 2}}>
      <LocalizedAbout/>
    </DialogContentText>
  </Dialog>;
};

AboutModal.propTypes = {
  isAboutModalOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

AboutModal.defaultProps = {
  isAboutModalOpen: false
};

export default AboutModal;

