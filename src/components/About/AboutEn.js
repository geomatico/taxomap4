import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const styledTitle = { py: 1, fontSize: '24px' };
const styledParagraph = { pb: 1, pl: 2, lineHeight: 1.3, fontSize: '14px'};
const styledText = { pl: 2, lineHeight: 1.3, fontSize: '14px'};
const linkStyle = { fontSize: '14px', color: '#57B4DF' };

const AboutEn = () => {
  return <>
    <Typography sx={styledTitle}>What is Taxo&Map?</Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map is an application originally intended for facilitating examination of the data on the collections of the Consortium of the Natural Science Museum of Barcelona, (MCNB). Taxo&Map permits search options that are complementary to other channels of consultation.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      The information on the MCNB’s collections can be searched via several websites. The most straightforward method is to select the search conditions using a web form. The museum supports several data portals that aggregate biodiversity information from different sources. The MCNB’s collection can be consulted at the GBIF website, currently the most universal, free and open biodiversity portal.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      In the two cases mentioned, searching for information is based on prior conditions established by the user making the consultation; then, the results are obtained. Taxo&Map works inversely. First of all, users are given an overview of all the data; then they can move around or zoom in or out on both the map and the biological classification until the data they wish to view or export are selected.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      At most recent versions, more institutions are providing data through Taxo&Map: Institut Botànic de Barcelona, Institut Mediterrani d’Estudis Avançats, Museu Valencià d’Història Natural I la Universitat de Barcelona. The MCNB appreciates the trust they have placed in Taxo&map.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map is the result of combining two aspirations:
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      · The Museum’s desire to display the data of its collections in a way more conducive to random searching.
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      · The capacity to design and anticipate needs and functions as shown by the project’s technological partners.
    </Typography>

    <Typography sx={styledTitle}>Application powered by</Typography>
    <Typography sx={styledParagraph}>
      Web and GIS development:
      <Link href='https://www.geomatico.es/en/' underline='none' sx={linkStyle}> www.geomatico.es</Link>
    </Typography>
    <Typography component='p' sx={styledParagraph}>
      Taxo&Map is an open source project. All components (PostgreSQL/PostGIS, Geoserver, React, MUI, MapLibre, Deck.gl) including the application
      <Link href='https://github.com/geomatico/taxomap4' underline='none' sx={linkStyle}> (https://github.com/geomatico/taxomap4) </Link>
       are open source.
    </Typography>
    <Typography sx={styledParagraph}>
      Supported browsers: Mozilla Firefox, Google Chrome. Last update: 31/05/2021
    </Typography>

    <Typography sx={styledTitle}>Contact related to the project</Typography>
    <Typography sx={styledText}>Dacha Atienza Ariznavarreta</Typography>
    <Typography sx={styledText}>Natural Science Museum of Barcelona</Typography>
    <Typography sx={styledParagraph}>datienzaa@bcn.cat</Typography>

    <Typography sx={styledParagraph}>Initial project manager: Francesc Uribe (MCNB)</Typography>

    <Typography sx={styledTitle}>Legal terms</Typography>
    <Typography sx={styledParagraph}>
      This work is licensed under a <Link href='https://creativecommons.org/licenses/by/4.0/' underline='none' sx={linkStyle}>Creative Commons Attribution 4.0 International License. </Link>
    </Typography>
  </>;
};

export default AboutEn;