import React, {useEffect, useState} from 'react';
import authService, {CannotRefreshTokenError} from '../../services/auth';
import taxomapService from '../../services/taxomapImpl';
import LoginForm from '../../components/login/LoginForm';
import {get, HttpError} from '@geomatico/client-commons';
import AdminPage from './AdminPage';
import Loading from '../../components/Loading';
import {Occurrency} from '../../components/TaxoTable';
import Papa, {ParseResult} from 'papaparse';
import {API_BASE_URL} from '../../config';



const Index = () => {
  const [isLogged, setLogged] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [dummyData, setDummyData] = useState<string>();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [data, setData] = useState<Array<Occurrency> | undefined>();

  const handleException = exceptionHandler(setLogged, setError);

  const handleLogin = (email: string, password: string) => {
    authService.login(email, password)
      .then(() => setLogged(true))
      .catch(handleException);
  };

  const handleUpload = (file: File) => {
    setIsLoading(true);
    taxomapService.uploadCsv(file)
      .then(() => setSuccess(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    taxomapService.downloadCsv()
      .then((res) => parseCsv(res))
      .then(() => setSuccess(true))
      .finally(() => setIsLoading(false));
  }, []);

  const parseCsv = (res: string | undefined) => {
    const result = res && Papa.parse(res, {
      header: true, // Trata la primera fila como encabezados
      skipEmptyLines: true,
    }) as ParseResult<Record<string, string>>;

    if(!result) {
      setData(undefined);
    }

    const data = result && result.data.map((row, index) => ({
      index,
      catalogNumber: row.catalognumber || '',
      institutionCode: row.institutioncode || '',
      basisOfRecord: row.basisofrecord || '',
      scientificName: row.scientificname || '',
      kingdom: row.kingdom || '',
      phylum: row.phylum || '',
      class: row.class || '',
      order: row.order || '',
      family: row.family || '',
      genus: row.genus || '',
      specificepithet: row.specificepithet || '',
    }));

    data !== '' ? setData(data) : setData(undefined);
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

  if (!isLogged) {
    return <LoginForm
      error={error}
      onLogin={handleLogin}
    />;
  } else if (dummyData) {
    return <AdminPage
      data={data}
      onUpload={handleUpload}
      isUploading={isLoading}
      success={success}
      onAlertAccept={() => setSuccess(false)}
    />;
  } else {
    return <Loading/>;
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
    if (e.payload && 'detail' in e.payload) {
      return e.payload.detail;
    }
    return e.text;
  } else if (e.message) {
    return e.message;
  } else {
    return `${e}`;
  }
};

export default Index;
