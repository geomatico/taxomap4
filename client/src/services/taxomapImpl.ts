import {post} from '@geomatico/client-commons';
import {API_BASE_URL} from '../config';

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
      return 'Subido con éxito'; //TODO Pedir todos los datos
    } else {
      throw new Error(response.message || 'Error al subir el archivo');
    }
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
};

export default {
  uploadCsv
};
