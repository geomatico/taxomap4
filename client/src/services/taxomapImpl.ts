import {API_BASE_URL, GEOSERVER_BASE_URL} from '../config';
import {WFS_TYPENAME} from '../wfs/wfs';

type UploadResponse = {
  status: number;
  message?: string;
}

const uploadCsv = async (file: File): Promise<string | void> => {

  try {
    const formData = new FormData();
    formData.append('data', file);

    const response: UploadResponse = await fetch(API_BASE_URL + '/upload-csv/', {
      method: 'POST',
      body: formData
    });

    if (response.status === 204) {
      await downloadCsv();
      return 'Subido con éxito';
    } else {
      throw new Error(response.message || 'Error al subir el archivo');
    }
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
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
