import React, {FC} from 'react';
import Dialog from '@mui/material/Dialog';
import {DialogActions, DialogContent, DialogTitle} from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import {useTranslation} from 'react-i18next';

//TYPES
export type AlertProps = {
  isOpen: boolean,
  title: string,
  description: string,
  onCancel?: () => void,
  onAccept?: () => void
};

const titleStyle = {
  color: 'secondary.main',
  '& h2': {
    fontWeight: 900
  }
};

const Alert: FC<AlertProps> = ({isOpen, title, description, onCancel, onAccept}) => {
  const {t} = useTranslation();
  return <Dialog open={isOpen}>
    <DialogTitle sx={titleStyle}>
      {title.toUpperCase()}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        {description}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {onCancel && <Button onClick={onCancel} color="secondary" variant='text'>
        {t('admin.cancel')}
      </Button>}
      {onAccept && <Button onClick={onAccept} color="secondary">
        {t('admin.accept')}
      </Button>}
    </DialogActions>
  </Dialog>;
};
export default Alert;