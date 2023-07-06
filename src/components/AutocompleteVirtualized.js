import React, {createContext, useContext, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete, {autocompleteClasses} from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme, styled} from '@mui/material/styles';
import {VariableSizeList} from 'react-window';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import useDictionaries from '../hooks/useDictionaries';
import {useMemo, useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {InputAdornment} from '@mui/material';
import {useTranslation} from 'react-i18next';

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {padding: 0, margin: 0},
  },
});

const autocompleteStyles = {
  width: '260px',
  '& .MuiOutlinedInput-root': {padding: '6px 9px'},
  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: '2.5px 4px 2px 6px',
    fontSize: 12,
  },
  '& .MuiAutocomplete-clearIndicator': {fontSize: '0.25rem'}

};

const LISTBOX_PADDING = 8; // px

const renderRow = (props) => {
  const {data, index, style} = props;
  const dataSet = data[index];
  const inlineStyle = {...style, top: style.top + LISTBOX_PADDING};

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle} sx={{fontSize: '12px'}}>
      {`${dataSet[1].label}`}
    </Typography>
  );
};

const OuterElementContext = createContext({});

// eslint-disable-next-line react/display-name
const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const useResetCache = (data) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current != null) ref.current.resetAfterIndex(0, true);
  }, [data]);
  return ref;
};

const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const {children, ...other} = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {noSsr: true,});
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;
  const getChildSize = () => itemSize;

  const getHeight = () => {
    if (itemCount > 8) return 8 * itemSize;
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});


export const AutocompleteVirtualized = ({onFilteredTaxonChange}) => {
  const {t} = useTranslation();
  const dictionaries = useDictionaries();
  const [options, setOptions] = useState([]);



  useMemo(() => {
    if (dictionaries) {
      const opts = Object.keys(dictionaries)
        .map((key) => {
          return dictionaries[key]
            .filter(el => el.name)
            .map(r => {
              return {level: key, id: r.id, label: r.name};
            });
        }).flat();
      //elimina resultados iguales, y luego filtra por labels iguales.
      let uniqueOpts = [...new Set(opts)].filter((v,i,a)=>a.findIndex(opt=>(opt.label===v.label))===i);
      setOptions(uniqueOpts);
    }

  }, [dictionaries]);

  const handleAutocompleteChange = (x, selected) => {
    onFilteredTaxonChange(selected);
  };

  return <>
    {options.length &&
      <Autocomplete
        value={null}
        sx={autocompleteStyles}
        disableListWrap
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={options}
        onChange={handleAutocompleteChange}
        //groupBy={(option) => option[0].toUpperCase()}
        renderInput={(params) => {
          return (
            <TextField
              hiddenLabel
              placeholder={t('search')}
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon/></InputAdornment>
                )
              }}
            />
          );
        }}
        renderOption={(props, option, state) => [props, option, state.index]}
        renderGroup={(params) => params}
      />
    }
  </>;
};

ListboxComponent.propTypes = {
  children: PropTypes.array,
};

AutocompleteVirtualized.propTypes = {
  onFilteredTaxonChange: PropTypes.func,
};