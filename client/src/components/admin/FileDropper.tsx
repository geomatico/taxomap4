import React, {FC, DragEvent, useState} from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from './Alert';
import {useTranslation} from 'react-i18next';

//TYPES
export type FileDropperProps = {
  onInput: (file: File) => void,
};

const FileDropper: FC<FileDropperProps> = ({onInput}) => {
  const {t} = useTranslation();
    
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [alertReason, setAlertReason] = useState<string | undefined>(undefined);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleInput = (file: File | null) => file && onInput(file);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 1) {
      setAlertReason('numberFiles');
      return;
    } else {
      if (files && files[0].type !== 'text/csv') {
        setAlertReason('errorType');
        return;
      }
    }
    files && handleInput(files[0]);
  };

  const handleAlertAccept = () => setAlertReason(undefined);
  
  const contentSx = {
    outline: isDragging ? '4px dashed lightgrey' : '0px solid lightgrey',
    bgcolor: isDragging ? '#f6f6f6' : 'white',
    m: 1,
    p: 0,
    width: 'auto',
    minheight: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2
  };
  
  const getTitleAlert = (reason: string) => {
    switch (reason) {
    case 'errorType':
      return t('admin.error');
    default:
      return '';
    }
  };
  
  const getDescriptionAlert = (reason: string) => {
    switch (reason) {
    case 'errorType':
      return t('admin.csvFileExpected');
    case 'numberFiles':
      return t('admin.singleFileExpected');
    default:
      return '';
    }
  };

  return <><Card elevation={1}>
    <CardHeader sx={{bgcolor: 'secondary.main', m: 0, py: 0}}
      title={<Typography variant='overline' sx={{fontSize: 12}}>{t('admin.addFile')}</Typography>}>
    </CardHeader>
    <CardContent sx={contentSx} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e)}>
      <Stack direction="row" sx={{justifyContent: 'center', alignItems: 'center', p: 0, m:0}}>
        <FileUploadIcon sx={{fontSize: 45}}/>
        <Typography>{t('admin.dropFileOr')}</Typography>
      </Stack>
      <Button variant='contained' component="label">
        <Typography variant='button'>{t('admin.selectCsv')}</Typography>
        <input
          type='file'
          hidden
          style={{display: 'none'}}
          accept={'.csv'}
          onChange={(e) => handleInput(e.target.files && e.target.files[0])}
        />
      </Button>
    </CardContent>
  </Card>
  {alertReason && 
    <Alert isOpen={!!alertReason} title={getTitleAlert(alertReason)} description={getDescriptionAlert(alertReason)} onAccept={handleAlertAccept}/>
  }
  </>;
};
export default FileDropper;