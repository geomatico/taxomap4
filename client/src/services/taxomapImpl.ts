import {API_BASE_URL, GEOSERVER_BASE_URL} from '../config';
import {WFS_TYPENAME} from '../wfs/wfs';
import auth from './auth';

type UploadError = {
  detail: string;
}

export type CsvUploadResult = {
  discardedRecords?: Blob,
  publishingFailed: boolean
}

const uploadCsv = async (file: File, lang: string): Promise<CsvUploadResult> => {
  const formData = new FormData();
  formData.append('data', file);

  const jwt = await auth.getAccessToken();

  const response = await fetch(API_BASE_URL + '/upload-csv/', {
    method: 'POST',
    body: formData,
    headers: {
      'accept-language': lang,
      authorization: `Bearer ${jwt}`
    }
  });

  if ([200, 204, 520].includes(response.status)) { // OK
    const csvText = await response.text();
    return {
      discardedRecords: csvText ? new Blob([csvText], {type: 'text/csv'}) : undefined,
      publishingFailed: response.status === 520 // Ver https://geomatico.atlassian.net/wiki/spaces/KB/pages/1523679233/API
    };
  } else if (response.status === 403) {
    throw new Error('No autorizado');
  } else {
    let body: UploadError;
    try {
      body = await response.json();
    } catch {
      throw new Error('Error al subir el archivo');
    }
    throw new Error(body?.detail || 'Error al subir el archivo');
  }
};

const downloadCsv = async () => {
  const url = new URL(GEOSERVER_BASE_URL + '/wfs');
  url.searchParams.append('version', '1.0.0');
  url.searchParams.append('request', 'GetFeature');
  url.searchParams.append('typeName', WFS_TYPENAME);
  url.searchParams.append('outputFormat', 'csv');
  url.searchParams.append('content-disposition', 'attachment');
  const urlString = url.toString();
    
  try {
    const response = await fetch(urlString);
    if (!response.ok) {
      throw new Error('Error al descargar el archivo CSV');
    }
    return await response.text();
  } catch (error) {
    console.error('Error al descargar el CSV:', error);
  }
};

export default {
  uploadCsv,
  downloadCsv
};
