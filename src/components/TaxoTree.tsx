import React, {FC, useState} from 'react';
import {lighten, Theme} from '@mui/material/styles';
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
import ListItemIcon from '@mui/material/ListItemIcon';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useSubtaxonCount from '../hooks/useSubtaxonCount';
import {BBOX, ChildCount, SubtaxonVisibility, Taxon, TaxonId, TaxonomicLevel, Range} from '../commonTypes';
import {CircularProgress} from '@mui/material';
import InfoIcon from './icons/InfoIcon';
import TaxonInfoModal from './TaxonInfoModal';

//STYLES
const contentTaxoStyle = {
  display: 'flex',
  justifyContent: 'space-between',
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
    backgroundColor: (theme: Theme) => lighten(theme.palette.secondary.main, 0.85),
  }
};


const listItemTextStyle = {
  color: (theme: Theme) => lighten(theme.palette.primary.main, 0.15),
};

export type TaxoTreeProps = {
  institutionFilter?: number,
  basisOfRecordFilter?: number,
  yearFilter?: Range,
  selectedTaxon: Taxon,
  onTaxonChanged: (taxon: Taxon) => void,
  BBOX?: BBOX,
  subtaxonVisibility?: SubtaxonVisibility,
  onSubtaxonVisibilityChanged: (visibility: SubtaxonVisibility) => void,
  childrenItems: Array<ChildCount>
}

const TaxoTree: FC<TaxoTreeProps> = ({institutionFilter, basisOfRecordFilter, yearFilter, selectedTaxon, subtaxonVisibility, BBOX, onSubtaxonVisibilityChanged, onTaxonChanged, childrenItems}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const subtaxonCountBBOX = useSubtaxonCount({
    institutionFilter,
    basisOfRecordFilter,
    yearFilter,
    selectedTaxon,
    BBOX,
    subtaxonVisibility
  });


  const dictionaries = useDictionaries();
  const {t} = useTranslation();

  const actualLevelIndex = TAXONOMIC_LEVELS.indexOf(selectedTaxon.level);
  const isRootLevel = actualLevelIndex === 0;
  const actualItem = dictionaries[selectedTaxon.level].find(item => item.id === selectedTaxon.id);

  const handleOnChildClick = (child: TaxonId) => {
    // TODO Corta la navegacion al nivel de species hasta que sepamos filtrar bien las subespecies indeterminadas
    if (selectedTaxon.level !== 'species') {
      onTaxonChanged({
        level: TAXONOMIC_LEVELS[actualLevelIndex + 1] as TaxonomicLevel,
        id: child
      });
    }
  };

  const handleOnParentClick = () => {
    const parentLevel = TAXONOMIC_LEVELS[actualLevelIndex - 1] as TaxonomicLevel;
    if (actualItem) {
      onTaxonChanged({
        level: parentLevel,
        id: actualItem[`${parentLevel}_id`] ?? NaN
      });
    }
  };

  // para niveles indeterminados ( el header del tree )
  if (actualItem?.name === '') {
    const parentLevel = TAXONOMIC_LEVELS[actualLevelIndex - 1] as TaxonomicLevel;

    const parent = dictionaries[parentLevel]
      .find(item => item.id === actualItem[`${parentLevel}_id`]);
    actualItem.name = `${parent?.name} [indet]`;
  }

  const handleOnSubtaxonVisibilityChange = (id: TaxonId) => {
    if (subtaxonVisibility) {
      onSubtaxonVisibilityChanged({
        ...subtaxonVisibility,
        isVisible: {
          ...subtaxonVisibility.isVisible,
          [id]: !subtaxonVisibility.isVisible[id]
        }
      });
    }
  };

  const handleOnMoreInfoClick = () => setIsModalOpen(true);

  return actualItem ? <>
    <Box sx={contentTaxoStyle}>
      <Box sx={{display:'flex'}}>
        {!isRootLevel && <Tooltip title={t('parentTaxon')} arrow>
          <KeyboardReturnIcon sx={iconTaxoStyle} onClick={handleOnParentClick}/>
        </Tooltip>}
        <Typography sx={labelTaxoStyle}>{actualItem.name}</Typography>
      </Box>
      <InfoIcon onClick={handleOnMoreInfoClick} style={{marginRight: '12px'}}/>
    </Box>
    <List dense sx={{ml: 2}}>
      {!childrenItems?.length &&
        <Box sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress size={30}/></Box>}
      {!!childrenItems?.length && subtaxonVisibility && childrenItems.map(child =>
        <ListItem key={child.id} disablePadding>
          <ListItemButton
            sx={listItemButtonStyle}
            component="a">
            <ListItemText onClick={() => handleOnChildClick(child.id)} sx={subtaxonVisibility.isVisible[child.id] ? listItemTextStyle : {color: '#949090'}}><span
              style={{fontWeight: 'bold'}}>{child.name}</span> - <span style={{fontSize: '10px', color: 'grey', fontWeight: 'bold'}} >
              {subtaxonCountBBOX[child.id] ? subtaxonCountBBOX[child.id] : 0} </span>
            <span style={{fontSize: '10px'}}> / {child.count}</span>
            </ListItemText>
            {subtaxonVisibility &&
              <ListItemIcon onClick={() => handleOnSubtaxonVisibilityChange(child.id)} sx={{minWidth: 33}}>
                {subtaxonVisibility.isVisible[child.id]
                  ? <VisibilityIcon sx={{fontSize: '1.2rem'}}/>
                  : <VisibilityOffIcon sx={{fontSize: '1.2rem', color: 'lightgrey'}}/>
                }
              </ListItemIcon>
            }
          </ListItemButton>
        </ListItem>
      )}
    </List>

    {isModalOpen && <TaxonInfoModal isModalOpen={isModalOpen} selectedTaxon={actualItem?.name as TaxonomicLevel} onModalOpenChange={setIsModalOpen}/>}

  </> : null;
};

export default TaxoTree;
