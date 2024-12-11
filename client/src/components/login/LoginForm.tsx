import React, {FC, useState} from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Avatar, FormHelperText, Grid, Paper} from '@mui/material';
import {SxProps} from '@mui/system';
import {useTranslation} from 'react-i18next';
import Stack from '@mui/material/Stack';

const errorText = {
  color: 'error.main',
  mb: 2,
  ml: 2
};
const loginButton = {
  //height: '48px',
  mt: 1,
};

export type LoginFormProps = {
  error?: string
  onLogin: (email: string, password: string) => void
}

const LoginForm: FC<LoginFormProps> = ({error, onLogin}) => {

  const {t} = useTranslation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLoginClick = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const containerSx: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '30vw',
    gap: 2
  };
  
  return  <Grid container component='main' sx={{height: '100vh'}}>
    <Grid item xs={false} sm={4} md={5} component={Paper} elevation={6} square
      sx={{bgcolor: 'common.black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <img src='./images/logos/logo.png' alt='Bioexplora' width='500px'/>
    </Grid>
    <Grid item xs={12} sm={8} md={7} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Box component="form" onSubmit={handleLoginClick} noValidate sx={containerSx}>
        <Stack>
          <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
            <LockIcon/>
          </Avatar>
          <Typography variant='overline' sx={{fontSize: 14}}>{t('login.enter')}</Typography>  
        </Stack>
          
        <TextField
          type="text"
          required
          fullWidth
          id="email"
          name="email"
          autoComplete="email"
          autoFocus
          placeholder="Email"
          onChange={event => setEmail(event.target.value)}
          value={email}
          InputProps={{startAdornment: <AccountCircleIcon sx={{marginRight: 1}}/>}}
        />
        <TextField
          required
          fullWidth
          name="password"
          type="password"
          id="password"
          autoComplete="current-password"
          placeholder="Password"
          onChange={event => setPassword(event.target.value)}
          value={password}
          InputProps={{startAdornment: <LockIcon sx={{marginRight: 1}}/>}}
        />
        <Typography variant="body2" sx={errorText}>
          { error && <FormHelperText>{error}</FormHelperText> }
        </Typography>
        <Button type="submit" fullWidth color='secondary' variant="contained" sx={loginButton}>
          {t('login.enter')}
        </Button>
      </Box>
    </Grid>
  </Grid>;
  
};

export default LoginForm;
