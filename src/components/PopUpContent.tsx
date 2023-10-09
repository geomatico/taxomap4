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
  itemId?: string,
  species?: DictionaryEntry,
  institution?: DictionaryEntry,
  lat?: number,
  lon?: number

}
const PopUpContent: FC<PopUpContentProps> = ({selectedFeature}) => {
  const {t} = useTranslation();

  const goToLearnMore = (selectedFeature: SelectedFeature) => {
    if (selectedFeature.institution?.id === MUSEU_ID) {
      const split = selectedFeature?.itemId?.split(' ');
      if(split) {
        const url = `https://www.bioexplora.cat/ca/colleccions-obertes/${split[0]}/${split[0]}_${split[1]}`;
        window.open(url);
      }
    }
  };

  return <Card variant="outlined">
    <CardContent>
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        {selectedFeature.itemId}
      </Typography>
      <Typography variant="h5" component="div">
        {selectedFeature.species?.name}
      </Typography>
      <Typography sx={{fontSize: 14}} color="text.secondary">
        {selectedFeature.institution?.name}
      </Typography>
    </CardContent>
    {
      selectedFeature.institution?.id === MUSEU_ID &&
      <CardActions>
        <Button onClick={() => goToLearnMore(selectedFeature)} size="small">{t('moreInfo')}</Button>
      </CardActions>
    }
  </Card>;
};

export default PopUpContent;
