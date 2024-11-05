import {useEffect, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {TaxomapData} from '../commonTypes';
import getTaxomapData from '../domain/usecases/getTaxomapData';

const useArrowData = (): TaxomapData | undefined => {
  const [data, setData] = useState<TaxomapData>();
  useEffect(() => {
    getTaxomapData().then(setData);
  }, []);
  return data;
};

export default singletonHook<TaxomapData | undefined>(undefined, useArrowData);
