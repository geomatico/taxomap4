import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const HelpModal = ({isHelpModalOpen, onClose}) => {
  return <Dialog
    fullScreen
    onClose={onClose}
    open={isHelpModalOpen}
    minHeight={1000}
    PaperProps={{
      sx: {
        width: 1024,
        height: 576
      }
    }}
    sx={{zIndex: 2000}}
  >
    <Card raised>
      <CardMedia
        component='iframe'
        autoPlay
        controls
        /*image='video.jpg'*/
        src='https://player.vimeo.com/video/252870272'
        sx={{width: 1024, height: 576, zIndex: 3000, p: 3}}
      />
    </Card>
  </Dialog>;
};

HelpModal.propTypes = {
  isHelpModalOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

HelpModal.defaultProps = {
  isHelpModalOpen: false
};

export default HelpModal;