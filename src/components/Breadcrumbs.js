import React from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';

import BreadcrumbItem from './BreadcrumItem';
import {getTaxonLabel} from '../taxonomicLevelUtils';

//STYLES

const Breadcrumbs = ({tree, onTaxonChange}) => {
  const treeLength = tree.length;
  const isLastStyle = (index) => index === 0 ? false : index === treeLength - 1;
  return <Box sx={{display: 'flex', flexDirection: 'row'}}>
    {
      tree.map((item, index) =>
        <BreadcrumbItem key={item.id + item.label} label={getTaxonLabel(item.label, tree[index - 1]?.label)}
          last={isLastStyle(index)} onItemBack={() => onTaxonChange(item)}/>)
    }
  </Box>;
};

Breadcrumbs.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.number,
    level: PropTypes.string,
  })),
  onTaxonChange: PropTypes.func.isRequired
};

Breadcrumbs.defaultProps = {};

export default Breadcrumbs;