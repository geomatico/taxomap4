import React, {FC} from 'react';

import Stack from '@mui/material/Stack';
import GeomaticoLink from '../../components/GeomaticoLink';
import FileDropper from '../../components/admin/FileDropper';
import TableDocumentation from '../../components/admin/TableDocumentation';
import {OFFSET_TOP} from '../../config';

type Props = {
  onUpload: (file: File) => void,
};

const SidePanelContent: FC<Props> = ({onUpload}) => {

  return <Stack direction="column" sx={{gap: 2, padding: 2, height: `calc(100vh - ${OFFSET_TOP})`, overflow: 'hidden'}}>
    <FileDropper onInput={file => onUpload(file)}/>
    <Stack sx={{flex: 1, overflowY: 'auto'}}>
      <TableDocumentation/>
    </Stack>
    <GeomaticoLink/>
  </Stack>;
};

export default SidePanelContent;
