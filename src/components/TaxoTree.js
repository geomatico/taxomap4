import React, {useState} from 'react';
import Box from '@mui/material/Box';
import useDictionaries from '../hooks/useDictionaries';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Typography from '@mui/material/Typography';
import {lighten} from '@mui/material/styles';
import {List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {DATA_PROPS} from '../config';

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

// TODO numero maximo de niveles. Esto molaria sacarlo del config, pero están mezclados los 7 niveles y los 3 filtros.
const MAX_LEVELS = 7;

const TaxoTree = () => {
  const dictionaries = useDictionaries();
  const [breadCrumbs, setBreadCrumbs] = useState([1]);

  const getName =(id)=> {
    const x = dictionaries[getLevelName(breadCrumbs.length - 1)].find(el => el.id === id);
    return x ? x.name : '';
  };

  const getLevelName = (level) => {
    return Object.keys(DATA_PROPS)[level];
  };

  const hasSubLevels = (element) => {
    return dictionaries[getLevelName(breadCrumbs.length + 1)]
      .filter(x => x[getLevelName(breadCrumbs.length) + '_id'] === element.id)
      .filter(y => y.name !== '')
      .length > 0;
  };

  const handleOnNextLevelClick = (element) => {
    // corto la navegacion en subespecies (nivel 7) o si no hay resultados por debajo de este nivel
    if (breadCrumbs.length < MAX_LEVELS && hasSubLevels(element)) {
      const newBreadcrumb = Array.from(breadCrumbs).concat([element.id]);
      setBreadCrumbs(newBreadcrumb);
    }
  };

  const handleOnPreviousLevelClick = () => {
    if (breadCrumbs.length > 1) {
      const newBreadcrumb = Array.from(breadCrumbs).splice(0, breadCrumbs.length - 1);
      setBreadCrumbs(newBreadcrumb);
    }
  };

  const selectedTaxo = dictionaries[getLevelName(breadCrumbs.length)]
    .filter(el => el[getLevelName(breadCrumbs.length - 1) + '_id'] === breadCrumbs[breadCrumbs.length - 1]);

  return <>
    <Box sx={contentTaxoStyle} onClick={handleOnPreviousLevelClick}>
      {
        breadCrumbs.length > 1 && <KeyboardReturnIcon sx={iconTaxoStyle}/>
      }
      <Typography sx={labelTaxoStyle}>{getName(breadCrumbs[breadCrumbs.length - 1])}</Typography>
    </Box>
    <List dense sx={{ml: 2}}>
      {
        selectedTaxo.map((el) => <ListItem key={el.name + el.id} disablePadding>
          <ListItemButton
            onClick={() => handleOnNextLevelClick(el)}
            sx={listItemButtonStyle}
            component="a">
            <ListItemText sx={listItemTextStyle}>{`${el.id} - ${el.name}`}</ListItemText>
          </ListItemButton>
        </ListItem>
        )}
    </List>
  </>;
};

export default TaxoTree;
