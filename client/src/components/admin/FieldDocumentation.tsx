import React, {FC} from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';

import {lighten, Theme} from '@mui/material/styles';
import Divider from '@mui/material/Divider';

//TYPES
export type FieldDocumentationProps = {
  fieldName: string,
  required: boolean,
  description: string,
  restrictions?: string,
  example?: string
};

const FieldDocumentation: FC<FieldDocumentationProps> = ({fieldName, required, description, restrictions, example}) => {

  const {t} = useTranslation();

  const hasRestrictions = (t(`admin.${fieldName}.restrictions`)) !== `admin.${fieldName}.restrictions`;

  const chipStyles = {
    fontSize: '14px',
    bgcolor: required ? '#30834a' : undefined,
    color: required ? 'common.white' : 'grey.700',
    fontWeight: 700
  };

  return <Stack direction="column">
    <Stack direction="row" sx={styles.field}>
      <code style={styles.code}>{fieldName}</code>
      <Chip size="small" label={required ? t('admin.required') : t('admin.optional')} sx={chipStyles}/>
    </Stack>
    <Stack sx={{mx: 2, mt: 1}}>
      <Typography variant="body2" sx={styles.description}>{description}</Typography>
      {hasRestrictions && <Stack direction="column" sx={styles.restrictions}>
        <Typography sx={styles.restrictionsTitle}>{t('admin.restrictions')}</Typography>
        <Typography variant="body2" sx={styles.text}>{restrictions}</Typography>
      </Stack>}
      {example && <Stack direction="row" sx={styles.examples}>
        <Typography sx={styles.examplesTitle}>{t('admin.example')}:</Typography>
        <Typography variant="body2" sx={styles.text}>{example}</Typography>
      </Stack>}
    </Stack>
    
    <Divider sx={{my: 3, mx: 1}}/>
  </Stack>;
};
export default FieldDocumentation;

const styles = {
  field: {
    gap: 1,
    alignItems: 'center'
  },
  code: {
    color: '#000000',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: 700
  },
  description: {
    fontStyle: 'italic',
    color: 'grey.600'
  },
  restrictions: {
    borderRadius: 1,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: (theme: Theme) => lighten(theme.palette.secondary.main, 0.5),
    width: '100%',
    my: 1,
    p: 1
  },
  restrictionsTitle: {
    color: 'secondary.main'
  },
  examples: {
    borderRadius: 1,
    backgroundColor: (theme: Theme) => lighten(theme.palette.grey[400], 0.8),
    width: '100%',
    my: 1,
    p: 1,
    gap: 1,
    alignItems: 'center'
  },
  examplesTitle: {
    color: 'grey.700'
  },
  text: {
    color: 'grey.700'
  }
};