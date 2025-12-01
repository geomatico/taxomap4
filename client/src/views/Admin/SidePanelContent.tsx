import React, {FC} from 'react';

import Stack from '@mui/material/Stack';
import GeomaticoLink from '../../components/GeomaticoLink';
import FileDropper from '../../components/admin/FileDropper';
import TableDocumentation from '../../components/admin/TableDocumentation';

type Props = {
  onUpload: (file: File) => void,
};

const SidePanelContent: FC<Props> = ({onUpload}) => {

  return <Stack sx={{gap: 2, padding: 2}}>
    <FileDropper onInput={file => onUpload(file)}/>
    <TableDocumentation/>
    <GeomaticoLink/>
  </Stack>;
};

export default SidePanelContent;
