import React, {FC} from 'react';
import Stack from '@mui/material/Stack';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';
import FieldDocumentation, {FieldDocumentationProps} from './FieldDocumentation';
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
          DOCUMENTATION_FIELDS.map(({fieldName, required, restrictions, description, example}) =>
            <FieldDocumentation
              key={fieldName}
              fieldName={fieldName}
              required={required}
              restrictions={restrictions}
              description={description}
              example={example}
            />)
        }
        <Typography sx={styles.paragraph}>
          {t('admin.moreInformation')}
        </Typography>
        <Link href="https://dwc.tdwg.org/list/" underline="none" sx={styles.link}>https://dwc.tdwg.org/list/</Link>
        <Typography sx={styles.paragraph}>
          {t('admin.uploadError')}
        </Typography>
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
    my: 2,
    height: '50vh',
    overflowY: 'auto'
  },
  paragraph: {
    color: 'grey.700',
    mt: 1
  },
  link: {
    fontSize: '18px',
    color: '#57B4DF',
    fontWeight: 600,
    display: 'inline',
    texDecoration: 'none'
  }
};

const DOCUMENTATION_FIELDS: Array<FieldDocumentationProps> = [
  {
    fieldName: 'institutionCode',
    required: true,
    restrictions: 'Solo puede tomar los valores IMEDEA | MCNB | MVHN | UB | IBB',
    description: 'Código de la institución que aloja la colección',
    example: 'IMEDEA'
  },
  {
    fieldName: 'collectionCode',
    required: false,
    restrictions: '',
    description: 'Indica la colección a la que pertenece la ocurrencia',
  },
  {
    fieldName: 'catalogNumber',
    required: true,
    restrictions: 'Debe ser único dentro de una institución y colección',
    description: 'Identificador único dentro de la institución y colección',
  },
  {
    fieldName: 'basisOfRecord',
    required: true,
    restrictions: 'Solo puede tomar los valores FOSSIL | NON_FOSSIL',
    description: 'Tipo de registro según la naturaleza del espécimen',
    example: 'FOSSIL'
  },
  {
    fieldName: 'taxonID',
    required: true,
    restrictions: 'Debe corresponderse con un identificador válido de GBIF',
    description: 'Identificador taxonómico según GBIF',
    example: 'https://www.gbif.org/species/1'
  },
  {
    fieldName: 'decimalLatitude',
    required: false,
    restrictions: 'Latitud WGS84 entre -90 y 90',
    description: 'Latitud geográfica del evento',
    example: '39.1234'
  },
  {
    fieldName: 'decimalLongitude',
    required: false,
    restrictions: 'Longitud WGS84 entre -180 y 180',
    description: 'Longitud geográfica del evento',
    example: '-3.5678'
  },
  {
    fieldName: 'eventDate',
    required: false,
    restrictions: 'Formato ISO YYYY-MM-DD',
    description: 'Fecha del evento',
    example: '2024-01-15'
  },
  {
    fieldName: 'countryCode',
    required: false,
    restrictions: 'Código ISO de 2 letras',
    description: 'País donde se registró la ocurrencia',
    example: 'ES'
  },
  {
    fieldName: 'stateProvince',
    required: false,
    description: 'División administrativa de primer nivel (CCAA)',
    example: 'Illes Balears'
  },
  {
    fieldName: 'county',
    required: false,
    description: 'División administrativa de segundo nivel (Provincia)',
    example: 'Mallorca'
  },
  {
    fieldName: 'municipality',
    required: false,
    description: 'División administrativa de tercer nivel (Municipio)',
    example: 'Palma'
  }
];