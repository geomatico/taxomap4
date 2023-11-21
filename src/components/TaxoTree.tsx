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
import ListItemIcon from '@mui/material/ListItemIcon';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useSubtaxonCount from '../hooks/useSubtaxonCount';
import {ChildCount, Filters, SubtaxonVisibility, Taxon, TaxonId, TaxonomicLevel} from '../commonTypes';
import TaxonInfoModal from './TaxonInfoModal';
import DownloadIcon from '@mui/icons-material/Download';
import {ArrowContainer, Popover} from 'react-tiny-popover';
import Link from '@mui/material/Link';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  findDictionaryEntry,
  getTaxonLabel,
  isRootTaxonomicLevel,
  nextTaxonomicLevel,
  previousTaxonomicLevel
} from '../taxonomicLevelUtils';
import {getWfsDownloadUrl} from '../wfs/wfs';

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

const availableDownloadFormats = {
  csv: 'csv',
  geojson: 'application/json'
};

const listItemTextStyle = {
  color: (theme: Theme) => lighten(theme.palette.primary.main, 0.15),
};

export type TaxoTreeProps = {
  filters : Filters,
  onTaxonChanged: (taxon: Taxon) => void,
  onSubtaxonVisibilityChanged: (visibility: SubtaxonVisibility) => void,
  childrenItems: Array<ChildCount>
}

const TaxoTree: FC<TaxoTreeProps> = ({filters, onSubtaxonVisibilityChanged, onTaxonChanged, childrenItems}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const subtaxonCountBBOX = useSubtaxonCount(filters);

  const dictionaries = useDictionaries();
  const {t} = useTranslation();

  const currentDictionaryEntry = findDictionaryEntry(filters.taxon.level, filters.taxon.id, dictionaries);

  const handleOnChildClick = (child: TaxonId) => onTaxonChanged({
    level: nextTaxonomicLevel(filters.taxon.level),
    id: child
  });

  const getLabel = (): string | undefined => {
    if (!currentDictionaryEntry) return;

    const parentLevel = previousTaxonomicLevel(filters.taxon.level);
    const parentId = currentDictionaryEntry[`${parentLevel}_id`] ?? NaN;
    const parentEntry = findDictionaryEntry(parentLevel, parentId, dictionaries);
    return getTaxonLabel(currentDictionaryEntry.name, parentEntry?.name);
  };

  const handleOnParentClick = () => {
    const parentLevel = previousTaxonomicLevel(filters.taxon.level);
    if (currentDictionaryEntry) {
      onTaxonChanged({
        level: parentLevel,
        id: currentDictionaryEntry[`${parentLevel}_id`] ?? NaN
      });
    }
  };

  const handleOnSubtaxonVisibilityChange = (id: TaxonId) => {
    if (filters.subtaxonVisibility) {
      onSubtaxonVisibilityChanged({
        ...filters.subtaxonVisibility,
        isVisible: {
          ...filters.subtaxonVisibility.isVisible,
          [id]: !filters.subtaxonVisibility.isVisible[id]
        }
      });
    }
  };

  const handleOnMoreInfoClick = () => setIsModalOpen(true);

  const handleDownloadClick = (value: HTMLElement) => {
    !anchorEl
      ? setAnchorEl(value)
      : setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadFile = (format: string) => {
    const url = getWfsDownloadUrl(format, filters);
    window.open(url, '_blank');
    setAnchorEl(null);
  };

  return currentDictionaryEntry ? <>
    <Box sx={contentTaxoStyle}>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        {!isRootTaxonomicLevel(filters.taxon.level) && <Tooltip title={t('parentTaxon')} arrow>
          <KeyboardReturnIcon sx={iconTaxoStyle} onClick={handleOnParentClick}/>
        </Tooltip>}
        <Typography sx={labelTaxoStyle}>{getLabel()}</Typography>
      </Box>
      <Box display='flex' alignItems='center'>
        <Tooltip title={t('infoTaxon')} placement="top">
          <InfoOutlinedIcon onClick={handleOnMoreInfoClick} sx={{mr: 1, fontSize: 16}}/>
        </Tooltip>

        <Popover
          isOpen={open}
          positions={['right']}
          padding={30}
          onClickOutside={handleClose}
          content={({position, childRect, popoverRect}) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={'white'}
              arrowSize={10}
              arrowStyle={{opacity: 0.9}}
              className='popover-arrow-container'
              arrowClassName='popover-arrow'
            >
              <div style={{backgroundColor: 'white', opacity: 0.9}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  {
                    Object.keys(availableDownloadFormats).map((format: string) => {
                      return <Link key={format} variant="body2" sx={{px: 2, py: 1, cursor: 'pointer', fontSize: 12}} onClick={() => downloadFile(availableDownloadFormats[format as keyof typeof availableDownloadFormats])}>
                        {t(format)}
                      </Link>;
                    })
                  }
                </Box>
              </div>
            </ArrowContainer>
          )}
        >
          <Box onClick={(event)=>handleDownloadClick(event.currentTarget)} style={{display: 'flex'}}>
            <Tooltip title={t('download')} placement="top">
              <DownloadIcon sx={{marginRight: '12px', fontSize: 16}}/>
            </Tooltip>
          </Box>
        </Popover>
      </Box>

    </Box>
    <List dense sx={{ml: 2}}>
      {(!childrenItems?.length || !currentDictionaryEntry.name) &&
        <Typography variant="caption" display="block" gutterBottom sx={{fontStyle: 'italic', ml: 2}}>
          {t('no_subtaxa')}
        </Typography>
      }
      {!!childrenItems?.length && currentDictionaryEntry.name && filters.subtaxonVisibility && childrenItems.map(child =>
        <ListItem key={child.id} disablePadding>
          <ListItemButton sx={listItemButtonStyle} component="a">
            <ListItemText onClick={() => handleOnChildClick(child.id)}
              sx={filters.subtaxonVisibility?.isVisible[child.id] ? listItemTextStyle : {color: '#949090'}}>
              <span style={{fontWeight: 'bold'}}>{getTaxonLabel(child.name, currentDictionaryEntry?.name)}</span> -
              <span style={{fontSize: '10px', color: 'grey', fontWeight: 'bold'}}>
                {subtaxonCountBBOX[child.id] ? subtaxonCountBBOX[child.id] : 0} </span>
              <span style={{fontSize: '10px'}}> / {child.count}</span>
            </ListItemText>

            {filters.subtaxonVisibility &&
              <ListItemIcon onClick={() => handleOnSubtaxonVisibilityChange(child.id)} sx={{minWidth: 33}}>
                {filters.subtaxonVisibility?.isVisible[child.id]
                  ? <VisibilityIcon sx={{fontSize: '1.2rem'}}/>
                  : <VisibilityOffIcon sx={{fontSize: '1.2rem', color: 'lightgrey'}}/>
                }
              </ListItemIcon>
            }
          </ListItemButton>
        </ListItem>
      )}
    </List>

    {isModalOpen && <TaxonInfoModal isModalOpen={isModalOpen} selectedTaxon={currentDictionaryEntry?.name as TaxonomicLevel} onModalOpenChange={setIsModalOpen}/>}

  </> : null;
};

export default TaxoTree;
