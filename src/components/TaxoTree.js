import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import useDictionaries from '../hooks/useDictionaries';
import {List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {DATA_PROPS} from '../config';

const TaxoTree = () => {
  const dictionaries = useDictionaries();
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(1); // guarda el indice del nivel en el que estamos
  const [selectedID, setSelectedID] = useState(1); // guarda el id del elemento seleccionado

  // TODO esto es solo para desarrollo, borrar al acabar
  useEffect(() => {
    console.log(getLevelName(selectedLevelIndex), 'Index: ', selectedLevelIndex);
    console.log('selectedId', selectedID, dictionaries[getLevelName(selectedLevelIndex - 1)].find(el => el.id === selectedID));
  }, [selectedLevelIndex, selectedID]);

  const getLevelName = (level) => {
    return Object.keys(DATA_PROPS)[level];
  };

  const handleOnClick = (element) => {
    setSelectedID(element.id);
    // corto la navegacion en subespecies (7)
    if (selectedLevelIndex < 7) setSelectedLevelIndex(selectedLevelIndex + 1);
  };

  const selectedTaxo = dictionaries[getLevelName(selectedLevelIndex)].filter(el => el[getLevelName(selectedLevelIndex - 1) + '_id'] === selectedID);

  return (
    <Box mb={1}>
      <List>
        {selectedTaxo.map((el) => {
          return <ListItem onClick={() => handleOnClick(el)} key={el.name + el.id} disablePadding>
            <ListItemButton component="a">
              <ListItemText> {`${el.id}: ${el.name}`}</ListItemText>
            </ListItemButton>
          </ListItem>;
        })}
      </List>
    </Box>
  );
};

export default TaxoTree;
