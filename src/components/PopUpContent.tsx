import React, {FC} from 'react';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';
import {CardActions, CardContent} from '@mui/material';
import {MUSEU_ID} from '../config';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import {DictionaryEntry} from '../commonTypes';

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
const PopUpContent: FC<PopUpContentProps> = ({selectedFeature}) => {
  const {t} = useTranslation();

  const getMoreInfoUrl = (selectedFeature: SelectedFeature) => {
    const split = selectedFeature?.catalognumber?.split(' ');
    return split ? `https://www.bioexplora.cat/ca/colleccions-obertes/${split[0]}/${split[0]}_${split[1]}` : '';
  };

  return <Card variant="outlined">
    <CardContent>
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        {selectedFeature.catalognumber}
      </Typography>
      <Typography variant="h5" component="div">
        {selectedFeature.species?.name}
      </Typography>
      <Typography sx={{fontSize: 14}} color="text.secondary">
        {selectedFeature.institutioncode?.name}
      </Typography>
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
