import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const styledTitle = { py: 1, fontSize: '24px' };
const styledParagraph = { pb: 1, pl: 2, lineHeight: 1.3, fontSize: '14px'};
const styledText = { pl: 2, lineHeight: 1.3, fontSize: '14px'};
const linkStyle = { fontSize: '14px', color: '#57B4DF' };

const AboutCa = () => {
  return <>
    <Typography sx={styledTitle}>Què és Taxo&Map?</Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map és una aplicació originalment dissenyada per a la immersió en les dades de les col·leccions del Consorci del Museu de Ciències Naturals de Barcelona, MCNB. Taxo&Map ofereix unes opcions de consulta complementàries a les proporcionades per altres vies.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      La informació de les col·leccions de l'MCNB es pot consultar en línia des de diversos webs. La manera més directa de fer-ho és a través d’un servei tradicional de cerca mitjançant formulari. El Museu dóna suport a diversos portals que agreguen informació de biodiversitat de diverses fonts. El fons del Museu és consultable al portal GBIF, en l’actualitat el més universal, obert i gratuït.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      En els dos casos referits, la cerca d’informació parteix de les condicions prèvies plantejades per qui fa la consulta; després vénen els resultats. Taxo&Map segueix una estratègia inversa. En primer lloc es visualitza tota la informació i a partir d’aquí l’usuari practica moviments de zoom i desplaçaments en l’àmbit geogràfic i taxonòmic fins a seleccionar les dades que desitja observar o exportar.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      En les versions més recents, més institucions estan proporcionant dades a través de Taxo&Map: l'Institut Botànic de Barcelona, l'Institut Mediterrani d'Estudis Avançats, el Museu Valencià d'Història Natural i la Universitat de Barcelona. El MCNB agraeix la confiança dipositada en Taxo&Map.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      El projecte Taxo&Map és el resultat d’unir dues ambicions:
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      · La voluntat del Museu de mostrar les dades de les col·leccions en condicions de cerca més especulativa.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      · La capacitat de disseny i d’anticipar necessitats i funcions que han demostrat els socis tecnològics del projecte.
    </Typography>
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <Typography sx={styledTitle}>Desenvolupament de l'aplicació</Typography>
    <Typography sx={styledParagraph}>
      Desenvolupament web i GIS:
      <Link href='https://www.geomatico.es/' underline='none' sx={linkStyle}> www.geomatico.es</Link>
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map és un projecte de codi lliure. Tots els components (PostgreSQL/PostGIS, Geoserver, React, MUI, MapLibre, Deck.gl) i el propi aplicatiu
      <Link href='https://github.com/geomatico/taxomap4' underline='none' sx={linkStyle}> (https://github.com/geomatico/taxomap4) </Link>
       són de codi obert.
    </Typography>
    <Typography sx={styledParagraph}>
      Navegadors suportats: Mozilla Firefox, Google Chrome. Última actualització: 09/01/2024
    </Typography>

    <Typography sx={styledTitle}>Contacte en relació amb el projecte</Typography>
    <Typography sx={styledText}>Eulàlia Garcia Franquesa</Typography>
    <Typography sx={styledText}>Museu de Ciències Naturals de Barcelona</Typography>
    <Typography sx={styledParagraph}>egarciafr@bcn.cat</Typography>

    <Typography sx={styledParagraph}>Responsable inicial del projecte: Francesc Uribe (MCNB)</Typography>

    <Typography sx={styledTitle}>Nota legal</Typography>
    <Typography sx={styledParagraph}>
      Aquesta obra està subjecta a una llicència de <Link href='https://creativecommons.org/licenses/by/4.0/' underline='none' sx={linkStyle}>Reconeixement 4.0 Internacional de Creative Commons. </Link>
    </Typography>
  </>;
};

export default AboutCa;