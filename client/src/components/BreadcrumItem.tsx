import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//STYLES
const TAG_HEIGHT = 40;

const container = {display: 'flex', flexDirection: 'row', ml: 2};

const tagStyle = (TAG_HEIGHT: number, last: boolean) => ({
  bgcolor: last ? 'grey.50' : 'secondary.main',
  display: 'inline-grid',
  placeItems: 'center',
  height: TAG_HEIGHT
});

const textStyle = (last: boolean) => ({
  fontWeight: 'bold',
  px: 2,
  color: last ? 'secondary.main' : 'text.contrastText',
  cursor: 'pointer',
  display: 'inline',
});

const triangleStyle = (TAG_HEIGHT: number) => ({
  bgcolor: 'secondary.main',
  width: 10,
  height: TAG_HEIGHT,
  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
  position: 'relative',
  left: -0.5
});

//TYPES
export type BreadcrumbItemProps = {
  label: string,
  last?: boolean,
  onItemBack: () => void
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({label, last=false, onItemBack}) => {
  
  return <Box sx={container} onClick={onItemBack}>
    <Box sx={tagStyle(TAG_HEIGHT, last)}>
      <Typography variant='body2' sx={textStyle(last)}>{label}</Typography>
    </Box>
    {
      !last && <Typography variant='body2' sx={triangleStyle(TAG_HEIGHT)}/>
    }
  </Box>;
};

export default BreadcrumbItem;