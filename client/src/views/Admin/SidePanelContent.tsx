import React, {FC} from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import GeomaticoLink from '../../components/GeomaticoLink';
import FileDropper from '../../components/admin/FileDropper';

type Props = {
  onUpload: (file: File) => void,
};

const SidePanelContent: FC<Props> = ({onUpload}) => {

  return <Stack sx={{ height: '100%', overflow: 'auto', padding: '20px' }}>
    <FileDropper onInput={file => onUpload(file)}/>
    <Divider/>
    <GeomaticoLink/>
  </Stack>;
};

export default SidePanelContent;
