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
import useSubtaxonCount from '../hooks/useSubtaxonCount';
import ListItemIcon from '@mui/material/ListItemIcon';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//STYLES
const contentTaxoStyle = {
  display: 'flex',
  cursor: 'pointer',
  bgcolor: 'secondary.main',
  borderRadius: 0.5,
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

const TaxoTree = ({institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon, childrenVisibility, BBOX, onChildrenVisibilityChanged, onTaxonChanged}) => {
  const dictionaries = useDictionaries();
  const subtaxonCountBBOX = useSubtaxonCount({institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon, BBOX});

  const {t} = useTranslation();

  const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  const isRootLevel = actualLevelIndex === 0;
  const isLeafLevel = actualLevelIndex === TAXONOMIC_LEVELS.length - 1;

  const actualItem = dictionaries[selectedTaxon.level].find(item => item.id === selectedTaxon.id);
  const childrenItems = isLeafLevel ? [] :
    dictionaries[TAXONOMIC_LEVELS[actualLevelIndex + 1]]
      .filter(item => item[`${selectedTaxon.level}_id`] === selectedTaxon.id)
      .map(item => ({
        ...item,
        name: item.name === '' ? `${actualItem.name} [indet]` : item.name
      }))
      .map(item => ({
        ...item,
        count: subtaxonCountBBOX[item.id] || 0
      }))
      .filter(item => item.count !== 0)
      .sort((a, b) => (a.count < b.count) ? 1 : -1);

  const handleOnChildClick = child => {
    // TODO Corta la navegacion al nivel de species hasta que sepamos filtrar bien las subespecies indeterminadas
    if (selectedTaxon.level !== 'species') {
      onTaxonChanged({
        level: TAXONOMIC_LEVELS[actualLevelIndex + 1],
        id: child.id
      });
    }
  };

  const handleOnParentClick = () => {
    const parentLevel = TAXONOMIC_LEVELS[actualLevelIndex - 1];
    onTaxonChanged({
      level: parentLevel,
      id: actualItem[`${parentLevel}_id`]
    });
  };

  // para niveles indeterminados ( el header del tree )
  if (actualItem?.name === '') {
    const parent = dictionaries[TAXONOMIC_LEVELS[actualLevelIndex - 1]]
      .find(item => item.id === actualItem[TAXONOMIC_LEVELS[actualLevelIndex - 1] + '_id']);
    actualItem.name = `${parent.name} [indet]`;
  }

  const handleOnSubtaxonVisibilityChange =(id)=> {
    const visib = {...childrenVisibility, ...{[id]: !childrenVisibility[id]}};
    onChildrenVisibilityChanged(visib);
  };

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
            sx={listItemButtonStyle}
            component="a">
            <ListItemText onClick={() => handleOnChildClick(child)} sx={listItemTextStyle}>{child.name} ({subtaxonCountBBOX[child.id] ? subtaxonCountBBOX[child.id] : 0} {t('of')} {child.count})</ListItemText>
            {childrenVisibility &&
              <ListItemIcon onClick={()=> handleOnSubtaxonVisibilityChange(child.id)} sx={{minWidth: 33}}>
                {childrenVisibility[child.id]
                  ? <VisibilityIcon id={child.id} sx={{fontSize: '1.2rem'}}/>
                  : <VisibilityOffIcon  sx={{fontSize: '1.2rem', color: 'lightgrey'}}/>
                }
              </ListItemIcon>
            }
          </ListItemButton>
        </ListItem>
      )}
    </List>
  </> : null;
};

TaxoTree.propTypes = {
  institutionFilter: PropTypes.number,
  basisOfRecordFilter: PropTypes.number,
  yearFilter: PropTypes.arrayOf(PropTypes.number),
  selectedTaxon: PropTypes.shape({
    level: PropTypes.oneOf(TAXONOMIC_LEVELS).isRequired,
    id: PropTypes.number.isRequired
  }).isRequired,
  onTaxonChanged: PropTypes.func.isRequired,
  BBOX: PropTypes.arrayOf(PropTypes.number),
  childrenVisibility: PropTypes.objectOf(PropTypes.bool), // solo valida el tipo de los values
  onChildrenVisibilityChanged: PropTypes.func,
};

export default TaxoTree;
