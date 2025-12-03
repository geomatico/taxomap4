import React, {FC} from 'react';
import Loading from '../../components/admin/Loading';
import TaxoTable from '../../components/admin/TaxoTable';
import {Skeleton} from '@mui/material';
import {Occurrence} from '../../commonTypes';
import Stack from '@mui/material/Stack';

type Props = {
  data?: Array<Occurrence>,
  isUploading: boolean
};

const MainContent: FC<Props> = ({data, isUploading}) => {
  return <Stack sx={{ overflow: 'auto', padding: '20px' }}>
    {data
      ? <TaxoTable data={data}/>
      : <Skeleton variant='rectangular' width='100%' height='90vh'/>
    }
    {isUploading && <Loading/>}
  </Stack>;
};
export default MainContent;