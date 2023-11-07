import React, {FC, useCallback, useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';
import {CardActions, CardContent} from '@mui/material';
import {MUSEU_ID} from '../config';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import {DictionaryEntry} from '../commonTypes';
import {FeatureProperties, getWfsFeatureProperties, WfsProperties} from '../wfs/wfs';

type PopUpContentProps = {
  selectedFeature: SelectedFeature,
}

export type SelectedFeature = {
  id?: number,
  catalognumber?: string,
  species?: DictionaryEntry,
  institutioncode?: DictionaryEntry,
  lat?: number,
  lon?: number
}

/**
 * Required WFS properties to fill the popup.
 */
const PROPERTIES = [
  WfsProperties.year, WfsProperties.month, WfsProperties.day,
  WfsProperties.municipality, WfsProperties.county, WfsProperties.stateProvince
];

export const getPlaceLabel = (properties: FeatureProperties): string | undefined => {
  const parts = [properties.municipality, properties.county, properties.stateProvince].filter(Boolean);
  if (parts.length === 0) {
    return undefined;
  } else if (parts.length === 1) {
    return `${parts[0]}`;
  }
  const last = parts.pop();
  return `${parts.join(', ')} (${last})`;
};

export const getDateLabel = (properties: FeatureProperties): string | undefined => {
  if (properties.year === undefined) {
    return;
  } else if (!properties.month) {
    return `${properties.year}`;
  }
  return [properties.year, properties.month, properties.day]
    .filter(Boolean)
    .map(part => String(part).padStart(2, '0'))
    .join('-');
};

const PopUpContent: FC<PopUpContentProps> = ({selectedFeature}) => {
  const {t} = useTranslation();
  const [featureProperties, setFeatureProperties] = useState<FeatureProperties>();

  const getMoreInfoUrl = (selectedFeature: SelectedFeature) => {
    const split = selectedFeature?.catalognumber?.split(' ');
    return split ? `https://www.bioexplora.cat/ca/colleccions-obertes/${split[0]}/${split[0]}_${split[1]}` : '';
  };

  const getWfsProperties = useCallback(async () =>
    await getWfsFeatureProperties(selectedFeature?.id, PROPERTIES), [selectedFeature]);
  useEffect(() => {
    getWfsProperties()
      .then(setFeatureProperties)
      .catch(console.log);
  }, [getWfsProperties]);

  const placeLabel = featureProperties && getPlaceLabel(featureProperties);
  const dateLabel = featureProperties && getDateLabel(featureProperties);

  return <Card variant="outlined">
    <CardContent>
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        {selectedFeature.catalognumber}
      </Typography>
      <Typography variant="subtitle1" sx={{textTransform: 'uppercase'}} component="div">
        {selectedFeature.species?.name}
      </Typography>
      <Typography sx={{fontSize: 14}} color="text.secondary">
        {selectedFeature.institutioncode?.name}
      </Typography>
      {placeLabel && <Typography variant="caption" sx={{marginTop:1, display: 'block'}} color="text.secondary">{placeLabel}</Typography>}
      {dateLabel && <Typography variant="caption" color="text.secondary">{dateLabel}</Typography>}
    </CardContent>
    {
      selectedFeature.institutioncode?.id === MUSEU_ID &&
      <CardActions>
        <Button href={getMoreInfoUrl(selectedFeature)} target="_blank" size="small">{t('moreInfo')}</Button>
      </CardActions>
    }
  </Card>;
};

export default PopUpContent;
