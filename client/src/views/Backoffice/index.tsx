import React, {useEffect, useState} from 'react';
import authService, {CannotRefreshTokenError} from '../../services/auth';
import taxomapService from '../../services/taxomapImpl';
import LoginForm from '../../components/login/LoginForm';
import { HttpError} from '@geomatico/client-commons';
import AdminPage from './AdminPage';
import Loading from '../../components/Loading';
import {GEOSERVER_BASE_URL} from '../../config';

const data = [
  {
    catalogNumber: '181219HH10',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Bithynia tentaculata',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Littorinimorpha',
    family: 'Bithyniidae',
    genus: 'Bithynia',
    specificepithet: 'tentaculata'
  },
  {
    catalogNumber: '090120PK01',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Aplus assimilis',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Neogastropoda',
    family: 'Pissaniidae',
    genus: 'Aplus',
    specificepithet: 'assimilis'
  },
  {
    catalogNumber: '280120VE01',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Aplus assimilis',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Neogastropoda',
    family: 'Pissaniidae',
    genus: 'Aplus',
    specificepithet: 'assimilis'
  },
  {
    catalogNumber: '280120VE02',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Aplus assimilis',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Neogastropoda',
    family: 'Pissaniidae',
    genus: 'Aplus',
    specificepithet: 'assimilis'
  },
  {
    catalogNumber: '280120VE03',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Mitrella psilla',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Neogastropoda',
    family: 'Columbellidae',
    genus: 'Mitrella',
    specificepithet: 'psilla'
  },
  {
    catalogNumber: '280120VE04',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Brachidontes pharaonis',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Bivalva',
    order: 'Mytilida',
    family: 'Mytilidae',
    genus: 'Brachidontes',
    specificepithet: 'pharaonis'
  },
  {
    catalogNumber: '010220BT01',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Fulvia fragilis',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Bivalva',
    order: 'Cardiida',
    family: 'Cardiidae',
    genus: 'Fulvia',
    specificepithet: 'fragilis'
  },
  {
    catalogNumber: '120220RT01',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Aplus assimilis',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Neogastropoda',
    family: 'Pissaniidae',
    genus: 'Aplus',
    specificepithet: 'assimilis'
  },
  {
    catalogNumber: '060320UY02',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Graniberia braunii',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Stylommatophora',
    family: 'Chondrinidae',
    genus: 'Graniberia',
    specificepithet: 'braunii'
  },
  {
    catalogNumber: '060320UY04',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Xerolenta obvia',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Stylommatophora',
    family: 'Geomitridae',
    genus: 'Xerolenta',
    specificepithet: 'obvia'
  },
  {
    catalogNumber: '120220FM01',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Teredo navalis',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Bivalva',
    order: 'Myida',
    family: 'Teredinidae',
    genus: 'Teredo',
    specificepithet: 'navalis'
  },
  {
    catalogNumber: '120220FM02',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Crassostraea gigas',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Bivalva',
    order: 'Ostreida',
    family: 'Ostreidae',
    genus: 'Crassostraea',
    specificepithet: 'gigas'
  },
  {
    catalogNumber: '120220FM03',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Semicassis granulata',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Littorinimorpha',
    family: 'Cassidae',
    genus: 'Semicassis',
    specificepithet: 'granulata'
  },
  {
    catalogNumber: '120220FM04',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Cthalmalus stellatus',
    kingdom: 'Animalia',
    phylum: 'Arthropoda',
    class: 'Hexanauplia',
    order: 'Sessilia',
    family: 'Cthalmalidae',
    genus: 'Cthalmalus',
    specificepithet: 'stellatus'
  },
  {
    catalogNumber: '270320YR02',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Helicella itala',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Stylommatophora',
    family: 'Geomitridae',
    genus: 'Helicella',
    specificepithet: 'itala'
  },
  {
    catalogNumber: '220420YT01',
    institutionCode: 'MVHN',
    basisOfRecord: 'PreservedSpecimen',
    scientificName: 'Corbellaria celtiberica',
    kingdom: 'Animalia',
    phylum: 'Mollusca',
    class: 'Gastropoda',
    order: 'Caenogastropoda',
    family: 'Hydrobiidae',
    genus: 'Corbellaria',
    specificepithet: 'celtiberica'
  }
];

const Index = () => {
  const [isLogged, setLogged] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [dummyData, setDummyData] = useState<string>();
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleException = exceptionHandler(setLogged, setError);

  const handleLogin = (email: string, password: string) => {
    authService.login(email, password)
      .then(() => setLogged(true))
      .catch(handleException);
  };

  const handleUpload = (file: File) => {
    setIsUploading(true);
    taxomapService.uploadCsv(file)
      .then(() => setSuccess(true))
      .finally(() => setIsUploading(false));
  };

  if (!isLogged) {
    return <LoginForm
      error={error}
      onLogin={handleLogin}
    />;
  } else if (dummyData) {
    return <Loading/>;
  } else {
    return <AdminPage data={data} onUpload={handleUpload} isUploading={isUploading} success={success} onAlertAccept={() => setSuccess(false)}/>;
  }

  useEffect(() => {
    const url = new URL(GEOSERVER_BASE_URL + '/wfs');
    console.log('url', url.toString());
  }, []);




  /*useEffect(() => {
    authService.isLogged()
      .then(setLogged)
      .catch(handleException);
  }, []);*/

  /*useEffect(() => {
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
  }, [isLogged]);*/

  if (!isLogged) {
    return <LoginForm
      error={error}
      onLogin={handleLogin}
    />;
  } else if (dummyData) {
    return <AdminPage onUpload={handleUpload}/>;
  } else {
    //return <Loading/>;
    return <AdminPage onUpload={handleUpload}/>;
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
