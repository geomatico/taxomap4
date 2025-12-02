import React, {FC} from 'react';
import Stack from '@mui/material/Stack';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';
import FieldDocumentation from './FieldDocumentation';
import Link from '@mui/material/Link';

const TableDocumentation: FC = () => {

  const {t} = useTranslation();

  return <Stack direction="column" sx={styles.container}>
    <Stack direction="row" sx={styles.title}>
      <HelpOutlineIcon color="secondary" sx={styles.icon}/>
      <Typography variant="h6" sx={styles.titleText}>{t('admin.documentation')}</Typography>
    </Stack>
    <Typography sx={styles.text}>{t('admin.csvSpecification')}</Typography>
    <Typography sx={styles.text}>- {t('admin.encoding')}</Typography>
    <Typography sx={styles.text}>- {t('admin.sparatedBy')}</Typography>

    <Stack direction="column" sx={{mt: 2}}>

      <Typography sx={styles.text}>{t('admin.downloadExample')}</Typography>
      <Link href="csv/exemple-taxomap.csv" underline="none" sx={styles.link}>{`${t('admin.example')}-taxomap.csv`}</Link>
      <Typography sx={{color: 'grey.700', mt: 2}}>{t('admin.firstRow')}</Typography>
      <Stack direction="column" sx={styles.fieldContainer}>
        {
          DOCUMENTATION_FIELDS.map(({fieldName, required, example}) =>
            <FieldDocumentation
              key={fieldName}
              fieldName={fieldName}
              required={required}
              restrictions={t(`admin.${fieldName}.restrictions`)}
              description={t(`admin.${fieldName}.description`)}
              example={example}
            />)
        }
        <Stack sx={{my: 1}}>
          <code style={styles.code}>institutionCode + collectionCode + catalogNumber</code>
          <Typography sx={styles.text}>{t('admin.uniqueIdentificator')}</Typography>
        </Stack>
        <Stack sx={{my: 1}}>
          <Typography sx={styles.paragraph}>{t('admin.moreInformation')}</Typography>
          <Link href="https://dwc.tdwg.org/list/" underline="none" sx={styles.link}>https://dwc.tdwg.org/list/</Link>
        </Stack>
        <Stack sx={{my: 1}}>
          <Typography sx={styles.paragraph}>{t('admin.uploadError')}</Typography>
        </Stack>
      </Stack>
    </Stack>
  </Stack>;
};
export default TableDocumentation;

const styles = {
  container: {
    gap: 1,
    justifyContent: 'center',
    mb: 2
  },
  title: {
    gap: 1,
    alignItems: 'center'
  },
  icon: {
    fontSize: '24px'
  },
  titleText: {
    color: 'secondary.main',
    fontSize: '20px'
  },
  text: {
    color: 'grey.700'
  },
  fieldContainer: {
    my: 2
  },
  paragraph: {
    color: 'grey.700'
  },
  link: {
    fontSize: '18px',
    color: '#57B4DF',
    fontWeight: 600,
    display: 'inline',
    texDecoration: 'none'
  },
  code: {
    color: '#000000',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: 700
  },
};

export type DocumentationFields = {
  fieldName: string,
  required: boolean,
  example?: string
}

const DOCUMENTATION_FIELDS: Array<DocumentationFields> = [
  {
    fieldName: 'institutionCode',
    required: true,
    example: 'IMEDEA'
  },
  {
    fieldName: 'collectionCode',
    required: false
  },
  {
    fieldName: 'catalogNumber',
    required: true
  },
  {
    fieldName: 'basisOfRecord',
    required: true,
    example: 'FOSSIL'
  },
  {
    fieldName: 'taxonID',
    required: true,
    example: '1254'
  },
  {
    fieldName: 'decimalLatitude',
    required: false,
    example: '39.1234'
  },
  {
    fieldName: 'decimalLongitude',
    required: false,
    example: '-3.5678'
  },
  {
    fieldName: 'eventDate',
    required: false,
    example: '2024-01-15'
  },
  {
    fieldName: 'countryCode',
    required: false,
    example: 'ES'
  },
  {
    fieldName: 'stateProvince',
    required: false,
    example: 'Illes Balears'
  },
  {
    fieldName: 'country',
    required: false,
    example: 'Mallorca'
  },
  {
    fieldName: 'municipality',
    required: false,
    example: 'Palma'
  }
];