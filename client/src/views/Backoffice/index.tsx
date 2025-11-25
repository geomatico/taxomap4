import React, {useEffect, useState} from 'react';
import Papa, {ParseResult} from 'papaparse';

import {HttpError} from '@geomatico/client-commons';
import {BasisOfRecord, InstitutionCode, Occurrence, VerificationSatus} from '../../commonTypes';
import authService, {CannotRefreshTokenError} from '../../services/auth';
import taxomapService, {CsvUploadResult} from '../../services/taxomapImpl';
import LoginForm from '../../components/login/LoginForm';
import Loading from '../../components/Loading';
import AdminPage from './AdminPage';
import Alert from '../../components/Alert';
import {useTranslation} from 'react-i18next';

const Index = () => {
  const {i18n: {language}} = useTranslation();
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Array<Occurrence> | undefined>();
  const [uploadResult, setUploadResult] = useState<CsvUploadResult | undefined>();

  const handleException = (e: Error) => {
    if (e instanceof CannotRefreshTokenError) {
      setLoggedIn(false);
    } else {
      setError(getError(e));
    }
  };

  const handleLogin = (email: string, password: string) => {
    authService.login(email, password)
      .then(() => setLoggedIn(true))
      .catch(handleException);
  };

  const handleUpload = (file: File) => {
    setLoading(true);
    taxomapService.uploadCsv(file, language)
      .then(setUploadResult)
      .catch(handleException)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    authService.isLogged()
      .then(setLoggedIn)
      .catch(handleException);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = () => {
    setLoading(true);
    setData(undefined);
    taxomapService.downloadCsv()
      .then((res) => parseCsv(res))
      .then(setData)
      .finally(() => setLoading(false));
  };

  let uploadFinishedMessage = uploadResult?.discardedRecords ? 'Se han incorporado parcialmente los datos. Al aceptar, se descargará un fichero con los datos descartados y el motivo de su rechazo.' : 'Se han incorporado todos los datos correctamente.';
  if (uploadResult?.publishingFailed) {
    uploadFinishedMessage += ' Aunque los datos se han incorporado a la base de datos, se ha producido un error en el proceso de publicación y no serán visibles. Contacta con el administrador del sistema para investigar la causa.';
  }

  const handleUploadFinishedAccept = () => {
    if (uploadResult?.discardedRecords) {
      downloadFile(uploadResult.discardedRecords, 'datos-descartados.csv');
    }
    setUploadResult(undefined);
    fetchData();
  };

  return !isLoggedIn ?
    <LoginForm error={error} onLogin={handleLogin}/> :
    data ? <>
      {error &&
        <Alert isOpen={true} title="Error" description={error} onAccept={() => setError(undefined)}/>
      }
      {uploadResult &&
        <Alert isOpen={true} title="Subida finalizada" description={uploadFinishedMessage} onAccept={handleUploadFinishedAccept}/>
      }
      <AdminPage data={data} onUpload={handleUpload} isUploading={isLoading}/>
    </> :
      <Loading/>;
};


const parseCsv = (res: string | undefined): Array<Occurrence> | undefined => {
  const result = res && Papa.parse(res, {
    header: true,
    skipEmptyLines: true
  }) as ParseResult<Record<string, string>>;

  if (result && result.data && result.data.length) {
    return result.data.map((row) => ({
      id: parseInt(row.FID.replace('taxomap.', '')),
      institutionCode: row.institutionCode as InstitutionCode,
      collectionCode: row.collectionCode || undefined,
      catalogNumber: row.catalogNumber,
      basisOfRecord: row.basisOfRecord as BasisOfRecord,
      taxonID: parseInt(row.taxonID),
      decimalLatitude: +parseFloat(row.decimalLatitude).toFixed(5),
      decimalLongitude: +parseFloat(row.decimalLongitude).toFixed(5),
      eventDate: row.eventDate ? new Date(row.eventDate) : undefined,
      countryCode: row.countryCode || undefined,
      stateProvince: row.stateProvince || undefined,
      county: row.county || undefined,
      municipality: row.municipality || undefined,
      georeferenceVerificationStatus: row.georeferenceVerificationStatus as VerificationSatus || undefined,
      identificationVerificationStatus: row.identificationVerificationStatus as VerificationSatus || undefined
    }));
  }
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

const downloadFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export default Index;
