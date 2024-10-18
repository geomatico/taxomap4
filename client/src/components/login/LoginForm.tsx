import React, {FC, useState} from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {FormHelperText} from '@mui/material';

const errorText = {
  color: 'error.main',
  mb: 2,
  ml: 2
};
const loginButton = {
  height: '48px',
  mt: 3,
  mb: 2
};

export type LoginFormProps = {
  error?: string
  onLogin: (email: string, password: string) => void
}

const LoginForm: FC<LoginFormProps> = ({error, onLogin}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLoginClick = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return <>
    <Box component="form" onSubmit={handleLoginClick} noValidate sx={{mt: 12, margin: 'auto', maxWidth:'40em'}}>
      <TextField
        type="text"
        margin="normal"
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
        margin="normal"
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={loginButton}
      >
        ENTRAR
      </Button>
    </Box>
  </>;
};

export default LoginForm;
