import React, {useEffect, useState} from 'react';
import authService, {CannotRefreshTokenError} from '../../services/auth';
import LoginForm from '../../components/login/LoginForm';
import {get, HttpError} from '@geomatico/client-commons';
import {API_BASE_URL} from '../../config';

const Index = () => {
  const [isLogged, setLogged] = useState<boolean>();
  const [error, setError] = useState<string>();
  const [dummyData, setDummyData] = useState<string>();

  const handleException = exceptionHandler(setLogged, setError);

  const handleLogin = (email: string, password: string) => {
    authService.login(email, password)
      .then(() => setLogged(true))
      .catch(handleException);
  };

  useEffect(() => {
    authService.isLogged()
      .then(setLogged)
      .catch(handleException);
  }, []);

  useEffect(() => {
    // TODO http calls should be somewhere else
    if (isLogged) {
      authService.getAccessToken().then(async accessToken => {
        const data = await get<string>({
          baseUrl: API_BASE_URL,
          path: 'holi',
          headers: {Authorization: 'Bearer ' + accessToken}
        });
        setDummyData(data);
      }).catch(handleException);
    }
  }, [isLogged]);

  if (isLogged === false) {
    return <LoginForm
      error={error}
      onLogin={handleLogin}
    />;
  } else if (dummyData) {
    return <div>{dummyData}</div>;
  } else {
    return <div>Loading...</div>;
  }
};

const exceptionHandler = (
  setLogged: (logged: boolean) => void,
  setError: (error: string) => void
) => {
  return (e: Error) => {
    if (e instanceof CannotRefreshTokenError) {
      setLogged(false);
    } else {
      setError(getError(e));
    }
  };
};

const getError = (e: Error): string => {
  if (e instanceof HttpError) {
    return 'detail' in e.payload ? e.payload.detail : e.text;
  } else if (e.message) {
    return e.message;
  } else {
    return `${e}`;
  }
};

export default Index;
