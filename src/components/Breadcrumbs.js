import React from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';

import BreadcrumbItem from './BreadcrumItem';

//STYLES

const Breadcrumbs = ({tree}) => {
  const treeLength = tree.length;
  const isLastStyle = (index) => index === 0 ? false : index === treeLength - 1 ? true : false;
  return <Box sx={{display: 'flex', flexDirection: 'row'}}>
    {
      tree.map((item, index) => {
        return <BreadcrumbItem key={item} name={item} last={isLastStyle(index)}/>;
      }
      )
    }
  </Box>;
};

Breadcrumbs.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.string)
};

Breadcrumbs.defaultProps = {};

export default Breadcrumbs;