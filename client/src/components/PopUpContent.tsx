import React, {FC, useCallback, useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';
import {CardActions, CardContent} from '@mui/material';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import {TaxonDictionaryEntry, FilterDictionaryEntry} from '../commonTypes';
import {getWfsFeatureProperties, WFS_PROPERTY, WfsProperties} from '../wfs/wfs';

import './utils/popUp.css';

export type SelectedFeature = {
  id?: number,
  catalognumber?: string,
  species?: TaxonDictionaryEntry,
  institutioncode?: FilterDictionaryEntry,
  lat?: number,
  lon?: number
}

/**
 * Required WFS properties to fill the popup.
 */
const PROPERTIES = [
  WFS_PROPERTY.eventDate,
  WFS_PROPERTY.municipality,
  WFS_PROPERTY.county,
  WFS_PROPERTY.stateProvince,
  WFS_PROPERTY.scientificName
];

type PopupWfsProperties = Partial<Pick<WfsProperties, 'eventDate' | 'municipality' | 'county' | 'stateProvince' | 'scientificName'>>;

const getMoreInfoUrl = (selectedFeature: SelectedFeature) => {
  const split = selectedFeature?.catalognumber?.split(' ');
  return split ? `https://www.bioexplora.cat/ca/colleccions-obertes/${split[0]}/${split[0]}_${split[1]}` : '';
};

export const getPlaceLabel = (properties: PopupWfsProperties): string | undefined => {
  const parts = [properties.municipality, properties.county, properties.stateProvince].filter(Boolean);
  if (parts.length === 0) {
    return undefined;
  } else if (parts.length === 1) {
    return `${parts[0]}`;
  }
  const last = parts.pop();
  return `${parts.join(', ')} (${last})`;
};

export const getDateLabel = (properties: PopupWfsProperties, lang: string): string | undefined => {
  return properties.eventDate?.toLocaleDateString(lang);
};




type Props = {
  selectedFeature: SelectedFeature,
  isTactile: boolean
}

const PopUpContent: FC<Props> = ({selectedFeature, isTactile}) => {
  const {t, i18n: {language}} = useTranslation();

  const [wfsProperties, setWfsProperties] = useState<PopupWfsProperties>();

  const getWfsProperties = useCallback(async () =>
    await getWfsFeatureProperties(selectedFeature?.id, PROPERTIES),
  [selectedFeature]);

  useEffect(() => {
    setWfsProperties(undefined);
    getWfsProperties()
      .then(setWfsProperties)
      .catch(console.log);
  }, [getWfsProperties]);

  const scientificNameLabel = wfsProperties?.scientificName || selectedFeature.species?.name;
  const placeLabel = wfsProperties && getPlaceLabel(wfsProperties);
  const dateLabel = wfsProperties && getDateLabel(wfsProperties, language);

  const nameAttr = language == 'es' ? 'name_es' : language == 'en' ? 'name_en' : 'name_ca';

  return <Card variant="outlined">
    <CardContent>
      <Typography variant='button' color="text.secondary">
        {selectedFeature.catalognumber}
      </Typography>
      <Typography variant="h5" sx={{mt: 1, textTransform: 'uppercase', fontWeight: 'bold'}} component="h3">
        {scientificNameLabel}
      </Typography>
      <Typography sx={{fontSize: 14}} color="text.secondary">
        {selectedFeature.institutioncode?.[nameAttr]}
      </Typography>
      {placeLabel &&
        <Typography variant="caption" sx={{marginTop: 1, display: 'block'}} color="text.secondary">
          {placeLabel}
        </Typography>}
      {dateLabel &&
        <Typography variant="caption" color="text.secondary">
          {dateLabel}
        </Typography>}
    </CardContent>
    {
      selectedFeature.institutioncode?.code === 'MCNB' && !isTactile &&
      <CardActions>
        <Link href={getMoreInfoUrl(selectedFeature)} color="inherit" underline="none" target="_blank" sx={{ml: 1,mb: 1, textTransform: 'uppercase'}}>
          {t('moreInfo')}
        </Link>
      </CardActions>
    }
  </Card>;
};

export default PopUpContent;
