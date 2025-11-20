import React, {FC} from 'react';
import Link from '@mui/material/Link';
import Logo_geomatico from '../../static/logos/Logo_geomatico.png';
import Stack from '@mui/material/Stack';

export type GeomaticoProps = {
  isTactile: boolean
}

const Geomatico: FC<GeomaticoProps> = ({isTactile}) => {
  return <Stack sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexGrow: 2, minHeight: 25, my: 1}}>
    {
      isTactile 
        ? <Stack sx={{display: 'flex', alignItems: 'flex-end'}}>
          <img src={Logo_geomatico} width={80} alt="geomatico.es"/>
        </Stack>
        : <Link href="https://geomatico.es" target="_blank" sx={{display: 'flex', alignItems: 'flex-end'}}>
          <img src={Logo_geomatico} width={80} alt="geomatico.es"/>
        </Link>
    }
  </Stack>;
};

export default Geomatico;