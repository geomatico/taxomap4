import React from 'react';
import PropTypes from 'prop-types';

import {lighten} from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import {useTranslation} from 'react-i18next';

import useDictionaries from '../hooks/useDictionaries';
import {TAXONOMIC_LEVELS} from '../config';

//STYLES
const contentTaxoStyle = {
  display: 'flex',
  cursor: 'pointer',
  bgcolor: 'secondary.main',
  borderRadius: 0.5,
  mt: 2,
  py: 1,
  px: 2
};

const labelTaxoStyle = {
  display: 'flex',
  color: 'text.contrastText',
  fontWeight: 'bold',
};

const iconTaxoStyle = {
  color: 'text.contrastText',
  mr: 1
};

const listItemButtonStyle = {
  borderRadius: 2,
  '&:hover': {
    backgroundColor: theme => lighten(theme.palette.secondary.main, 0.85),
  }
};

const listItemTextStyle = {
  color: theme => lighten(theme.palette.primary.main, 0.15),
};

const TaxoTree = ({selectedTaxon, onTaxonChanged}) => {
  const dictionaries = useDictionaries();
  const {t} = useTranslation();

  const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  const isRootLevel = actualLevelIndex === 0;
  const isLeafLevel = actualLevelIndex === TAXONOMIC_LEVELS.length - 1;

  const actualItem = dictionaries[selectedTaxon.level].find(item => item.id === selectedTaxon.id);
  const childrenItems = isLeafLevel ? [] :
    dictionaries[TAXONOMIC_LEVELS[actualLevelIndex + 1]]
      .filter(item => item[`${selectedTaxon.level}_id`] === selectedTaxon.id)
      .map(item => ({...item, name: item.name === '' ? `${actualItem.name} [indet]` : item.name}))
      .sort((a, b) => (a.name > b.name) ? 1 : -1);

  const handleOnChildClick = child => onTaxonChanged({
    level: TAXONOMIC_LEVELS[actualLevelIndex + 1],
    id: child.id
  });

  const handleOnParentClick = () => {
    const parentLevel = TAXONOMIC_LEVELS[actualLevelIndex - 1];
    onTaxonChanged({
      level: parentLevel,
      id: actualItem[`${parentLevel}_id`]
    });
  };

  // para niveles indeterminados
  if(actualItem?.name === '') {
    const parent = dictionaries[TAXONOMIC_LEVELS[actualLevelIndex -1]].find(item => item.id === actualItem[TAXONOMIC_LEVELS[actualLevelIndex -1] + '_id']);
    actualItem.name = `${parent.name} [indet]`;
  }

  return actualItem ? <>
    <Box sx={contentTaxoStyle}>
      {!isRootLevel && <Tooltip title={t('parentTaxon')} arrow>
        <KeyboardReturnIcon sx={iconTaxoStyle} onClick={handleOnParentClick}/>
      </Tooltip>}
      <Typography sx={labelTaxoStyle}>{actualItem.name}</Typography>
    </Box>
    <List dense sx={{ml: 2}}>
      {childrenItems.map(child =>
        <ListItem key={child.id} disablePadding>
          <ListItemButton
            onClick={() => handleOnChildClick(child)}
            sx={listItemButtonStyle}
            component="a">
            <ListItemText sx={listItemTextStyle}>{child.name}</ListItemText>
          </ListItemButton>
        </ListItem>
      )}
    </List>
  </> : null;
};

TaxoTree.propTypes = {
  selectedTaxon: PropTypes.shape({
    level: PropTypes.oneOf(TAXONOMIC_LEVELS).isRequired,
    id: PropTypes.number.isRequired
  }).isRequired,
  onTaxonChanged: PropTypes.func.isRequired
};

export default TaxoTree;
