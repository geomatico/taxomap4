import React, {FC, DragEvent, useState} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from './Alert';

//TYPES
export type FileDropperProps = {
  onDrop: () => void,
  onDragOver: () => void,
  onDragEnter: () => void,
  onDragLeave: () => void,
  onInput: (file: File) => void,
};

const FileDropper: FC<FileDropperProps> = ({onInput}) => {
    
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
    outline: isDragging ? '4px dashed lightgrey' : '1px solid lightgrey',
    bgcolor: isDragging ? '#f6f6f6' : 'white',
    m: 2,
    width: 'auto',
    minheight: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 2,
    gap: 2
  };
  
  const getTitleAlert = (reason: string) => {
    switch (reason) {
    case 'errorType':
      return 'Error';
    default:
      return '';
    }
  };
  
  const getDescriptionAlert = (reason: string) => {
    switch (reason) {
    case 'errorType':
      return 'Se espera un archivo de datos en formato .csv';
    case 'numberFiles':
      return 'Por favor, añade un solo fichero';
    default:
      return '';
    }
  };
  
  return <><Card elevation={0}>
    <CardHeader sx={{bgcolor: 'secondary.main', m: 0, py: 0}}
      title={<Typography variant='overline' component='h5'>Añadir archivo de datos</Typography>}>
    </CardHeader>
    <CardContent sx={contentSx} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e)}>
      <FileUploadIcon sx={{fontSize: 50}}/>
      <Typography>Arrastre aquí un un archivo o</Typography>
      <Button variant='contained' component="label">
        <Typography variant='button'>SELECCIONAR ARCHIVO CSV</Typography>
        <input
          type='file'
          hidden
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