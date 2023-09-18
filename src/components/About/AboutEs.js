import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const styledTitle = { py: 1, fontSize: '24px' };
const styledParagraph = { pb: 1, pl: 2, lineHeight: 1.3, fontSize: '14px'};
const styledText = { pl: 2, lineHeight: 1.3, fontSize: '14px'};
const linkStyle = { fontSize: '14px', color: '#57B4DF' };

const AboutEs = () => {
  return <>
    <Typography sx={styledTitle}>¿Qué es Taxo&Map?</Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map es una aplicación originalmente diseñada para la inmersión en los datos de las colecciones del Consorcio del Museo de Ciencias Naturales de Barcelona, MCNB. Taxo&Map ofrece unas opciones de consulta complementarias a las proporcionadas por otras vías.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      La información de las colecciones del MCNB se puede consultar en línea desde varias webs. La forma más directa es realizarlo a través de un servicio tradicional de búsqueda por formulario. El Museo da apoyo a varios portales que agregan información de biodiversidad de distintas fuentes. El fondo del Museo es consultable en el portal GBIF, actualmente el más universal, abierto y gratuito.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      En los dos casos referidos la búsqueda de información parte de las condiciones previas planteadas por quien formula la consulta; después vienen los resultados. Taxo&Map sigue una estrategia inversa. En primer lugar se visualiza toda la información y a partir de aquí el usuario practica movimientos de zoom y desplazamientos en el ámbito geográfico y taxonómico hasta seleccionar los datos que desea observar o exportar.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      En las versiones más recientes, más instituciones están proporcionando datos a través de Taxo&Map: Institut Botànic de Barcelona, el Institut Mediterrani d’Estudis Avançats, el Museu Valencià d’Història Natural y la Universitat de Barcelona. El MCNB agradece la confianza depositada en Taxo&Map.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map es el resultado de unir dos ambiciones:
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      · La voluntad del Museo de mostrar los datos de las colecciones en condiciones de búsqueda más especulativa.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      · La capacidad de diseño y de anticipar necesidades y funciones que han demostrado los socios tecnológicos del proyecto.
    </Typography>

    <Typography sx={styledTitle}>Desarrollo de la aplicación</Typography>
    <Typography sx={styledParagraph}>
      Desarrollo web y GIS:
      <Link href='https://www.geomatico.es/' underline='none' sx={linkStyle}> www.geomatico.es</Link>
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map es un proyecto de código libre. Todos los componentes (PostgreSQL/PostGIS, Geoserver, React, MUI, MapLibre, Deck.gl) y la propia aplicación
      <Link href='https://github.com/geomatico/taxomap4' underline='none' sx={linkStyle}> (https://github.com/geomatico/taxomap4) </Link>
       son de código abierto.
    </Typography>
    <Typography sx={styledParagraph}>
      Navegadores soportados: Mozilla Firefox, Google Chrome. Última actualización: 15/09/2023
    </Typography>

    <Typography sx={styledTitle}>Contacto en relación al proyecto</Typography>
    <Typography sx={styledText}>Eulàlia Garcia Franquesa</Typography>
    <Typography sx={styledText}>Museo de Ciencias Naturales de Barcelona</Typography>
    <Typography sx={styledParagraph}>egarciafr@bcn.cat</Typography>

    <Typography sx={styledParagraph}>Responsable inicial del proyecto: Francesc Uribe (MCNB)</Typography>

    <Typography sx={styledTitle}>Nota legal</Typography>
    <Typography sx={styledParagraph}>
      Esta obra está bajo una <Link href='https://creativecommons.org/licenses/by/4.0/' underline='none' sx={linkStyle}>Licencia Creative Commons Atribución 4.0 Internacional. </Link>
    </Typography>
  </>;
};

export default AboutEs ;