import {post} from '@geomatico/client-commons';
import {API_BASE_URL} from '../config';

type UploadResponse = {
  status: number;
  message?: string;
}

const uploadCsv = async (file: File): Promise<string | void> => {

  const csv = await file.text();
  try {
    const response: UploadResponse = await post({
      baseUrl: API_BASE_URL,
      path: 'upload-csv/',
      headers: {
        'Content-Type': `multipart/form-data;boundary=${encodeURIComponent(csv)}`,
        'Content-Disposition': `attachment; filename=${file.name}`
      },
      //body: `data=${encodeURIComponent(csv)}`,
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
