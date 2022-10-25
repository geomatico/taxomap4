import React from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//STYLES
const TAG_HEIGHT = 40;

const BreadcrumbItem = ({taxo, last, onItemBack}) => {
  const tagStyle = {
    bgcolor: last? 'grey.50' : 'secondary.main',
    display: 'inline-grid',
    placeItems: 'center',
    height: TAG_HEIGHT
  };
  const textStyle = {
    fontWeight: 'bold',
    px: 2,
    color: last? 'secondary.main' : 'text.contrastText',
    cursor: 'pointer',
    display: 'inline',
  };
  const triangleStyle = {
    bgcolor: 'secondary.main',
    width: 10,
    height: TAG_HEIGHT,
    clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
    position: 'relative',
    left: -0.5
  };

  return <Box sx={{display: 'flex', flexDirection: 'row', ml: 2}} onClick={() => onItemBack(taxo)}>
    <Box sx={tagStyle}>
      <Typography variant='body2' sx={textStyle}>{taxo.label}</Typography>
    </Box>
    {!last && <Box variant='body2' sx={triangleStyle}/>}
  </Box>;
};

BreadcrumbItem.propTypes = {
  taxo: PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.number,
    level: PropTypes.string,
  }).isRequired,
  last: PropTypes.bool,
  onItemBack: PropTypes.func.isRequired
};

BreadcrumbItem.defaultProps = {
  last: false
};

export default BreadcrumbItem;