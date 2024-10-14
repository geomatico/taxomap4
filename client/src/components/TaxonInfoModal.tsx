import React, {FC, useState} from 'react';
import Box from '@mui/material/Box';
import {useTranslation} from 'react-i18next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Modal from '@mui/material/Modal';
import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';
import {TaxonomicLevel} from '../commonTypes';
import useFetch from '@geomatico/geocomponents/hooks/useFetch';
import {CircularProgress} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const modalStyle = {
  overflow: 'scroll',
  maxHeight: '85vh',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  bgcolor: 'background.paper',
  border: '0 solid #000',
  boxShadow: 24,
  p: 4,
};

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`}{...other}>
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

type TaxonInfoModalProps = {
  selectedTaxon: TaxonomicLevel,
  isModalOpen: boolean,
  onModalOpenChange: (_isOpen: boolean) => void,
}

const TaxonInfoModal: FC<TaxonInfoModalProps> = ({selectedTaxon, isModalOpen, onModalOpenChange}) => {
  const handleClose = () => onModalOpenChange(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(parseInt(newValue));
  };

  const {i18n} = useTranslation();

  const url = `https://${i18n.resolvedLanguage}.wikipedia.org/w/api.php?action=parse&prop=text&section=0&format=json&page=${selectedTaxon}&contentformat=text%2Fx-wiki&redirects=&origin=*`;
  const {data, isWaiting} = useFetch<{parse: {text: {'*': string}}}>(url);
  let htmlDoc: Document | undefined = undefined;

  if (data) {
    const res = data?.parse?.text['*'];
    const y = res.replace(/\\n/g, '');
    const x = y.replace(/\\"/g, '"');

    const parser = new DOMParser();
    htmlDoc = parser.parseFromString(x, 'text/html');

    htmlDoc.querySelectorAll('area').forEach(areaElmt => areaElmt.remove());
    htmlDoc.querySelectorAll('.mw-ext-cite-error').forEach(elem => elem.remove());
    htmlDoc.querySelectorAll('.reference').forEach(elem => elem.remove());
    htmlDoc.querySelectorAll('.references').forEach(elem => elem.remove());
    htmlDoc.querySelectorAll('.noprint').forEach(elem => elem.remove());
    htmlDoc.getElementById('Timeline-row')?.remove();
    htmlDoc.querySelectorAll('a').forEach(elem => elem.replaceWith(elem.innerText));
  }

  return <Modal
    open={isModalOpen}
    onClose={handleClose}
    sx={{zIndex: '3000'}}
  >
    <Box sx={modalStyle}>
      <Typography variant="h4" gutterBottom>{selectedTaxon}</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={0} label="Wikipedia"/>
          <Tab value={1} label="Links"/>
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        {!isWaiting && htmlDoc
          ? parse(htmlDoc.body.innerHTML)
          : <CircularProgress size={20}/>
        }
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <div id="tabLinks" className="tabContent" style={{display: 'flex', justifyContent: 'center', alignItems: 'end'}}>
          <a id="wikispecies" href={`https://species.wikimedia.org/wiki/${selectedTaxon}`} target="_blank" rel="noreferrer">
            <img alt="Wikispecies Logo" title="Wikispecies" src="images/logos/wikispecies.png" style={{padding: '20px'}}/>
          </a>
          <a id="eol" href={`https://www.eol.org/search?q=${selectedTaxon}`} target="_blank" rel="noreferrer">
            <img alt="Encyclopedia Of Life Logo" title="Encyclopedia Of Life" src="images/logos/eol.png" style={{padding: '20px'}}/>
          </a>
          <a id="gbif" href={`https://www.gbif.org/species/search?q=${selectedTaxon}`} target="_blank" rel="noreferrer">
            <img alt="GBIF Logo" title="GBIF" src="images/logos/gbif.svg" style={{padding: '20px', height: '90px'}}/>
          </a>
        </div>
      </TabPanel>
    </Box>
  </Modal>;
};


export default TaxonInfoModal;
