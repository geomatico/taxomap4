import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useDictionaries from '../hooks/useDictionaries';
import styled from '@mui/styles/styled';
import {List, ListItem, ListItemButton, ListItemText} from '@mui/material';

const TaxoTree = () => {
  const dictionaries = useDictionaries();
  console.log(444, dictionaries)

  const [selected, setSelected] = useState([]);


  const handleOnClick =(e, key, values)=> {
    console.log(111, e, key, values);
    e.preventDefault();
    setSelected(values);

  }


  return (
    <Box mb={1}>
  <List>
        {selected.map(([key, values]) => {
          return <ListItem onClick={()=> handleOnClick(key, values)} key={key} disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText> {`${key}: ${values.length}`}</ListItemText>
            </ListItemButton>
          </ListItem>;
        })}
      </List>
      ----------------------
      <List>
        {Object.entries(dictionaries).map(([key, values]) => {
          return <ListItem onClick={(e)=> handleOnClick(e, key, values)} key={key} disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText> {`${key}: ${values.length}`}</ListItemText>
            </ListItemButton>
          </ListItem>;
        })}
      </List>


    </Box>
  );
};

TaxoTree.propTypes = {};

export default TaxoTree;
