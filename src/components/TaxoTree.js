import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import useDictionaries from '../hooks/useDictionaries';
import {List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {DATA_PROPS} from '../config';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const TaxoTree = () => {
  const dictionaries = useDictionaries();

  const [breadCrumbs, setBreadCrumbs] = useState([1]);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(1); // guarda el indice del nivel en el que estamos

  // TODO esto es solo para desarrollo, borrar al acabar
  useEffect(() => {
    console.log('Level name:', getLevelName(selectedLevelIndex), '---', 'Index:', selectedLevelIndex);
    console.log('breadCrumbs', breadCrumbs, dictionaries[getLevelName(selectedLevelIndex - 1)].find(el => el.id === breadCrumbs[breadCrumbs.length - 1]));
  }, [selectedLevelIndex, breadCrumbs]);

  const getLevelName = (level) => {
    return Object.keys(DATA_PROPS)[level];
  };

  const hasSubLevelItems = (element) => {
    return dictionaries[getLevelName(selectedLevelIndex + 1)]
      .filter(x => x[getLevelName(selectedLevelIndex) + '_id'] === element.id)
      .filter(y => y.name !== '')
      .length > 0;
  };

  const handleOnNextLevelClick = (element) => {
    // corto la navegacion en subespecies (nivel 7) o si no hay resultados por debajo de este nivel
    if (selectedLevelIndex < 7 && hasSubLevelItems(element)) {
      const newBreadcrumb = Array.from(breadCrumbs.concat([element.id]));
      setBreadCrumbs(newBreadcrumb);
      setSelectedLevelIndex(selectedLevelIndex + 1);
    }
  };

  const handleOnPreviousLevelClick = () => {
    if (breadCrumbs.length > 1) {
      const newBreadcrumb = Array.from(breadCrumbs).splice(0, breadCrumbs.length - 1);
      setBreadCrumbs(newBreadcrumb);
      setSelectedLevelIndex(selectedLevelIndex - 1);
    }
  };

  const selectedTaxo = dictionaries[getLevelName(selectedLevelIndex)]
    .filter(el => el[getLevelName(selectedLevelIndex - 1) + '_id'] === breadCrumbs[breadCrumbs.length - 1]);

  return (
    <Box mb={1}>
      <Box sx={{
        display: 'flex',
        cursor: 'pointer'
      }} onClick={handleOnPreviousLevelClick}>
        {breadCrumbs.length > 1 &&
          <KeyboardReturnIcon/>
        }
        <div>{getLevelName(selectedLevelIndex -1)}</div>
      </Box>
      <List>
        {selectedTaxo.map((el) => {
          return <ListItem
            key={el.name + el.id}
            disablePadding
            sx={{border: '1px solid black'}}>
            <ListItemButton onClick={() => handleOnNextLevelClick(el)} component="a">
              <ListItemText> {`${el.id} - ${el.name}`}</ListItemText>
            </ListItemButton>
          </ListItem>;
        })}
      </List>
    </Box>
  );
};

export default TaxoTree;
