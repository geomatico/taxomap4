import {useEffect, useMemo, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {tableFromIPC} from 'apache-arrow';
import {DATA_PROPS} from '../config';

const useArrowData = () => {
  const [arrowTable, setArrowTable] = useState();

  useEffect(() => {
    tableFromIPC(fetch('data/taxomap_ultralite.arrow')).then(setArrowTable);
  }, []);

  const data = useMemo(() => {
    return arrowTable && {
      length: arrowTable.numRows,
      attributes: {
        getPosition: {
          value: arrowTable.getChild('geometry').getChildAt(0).data[0].values,
          size: 2
        }
      },
      ...Object.keys(DATA_PROPS).reduce((acc, field) => {
        acc[field] = arrowTable.getChild(DATA_PROPS[field]).data[0].values;
        return acc;
      }, {}),
      id: arrowTable.getChild('id').toArray()
    };
  }, [arrowTable]);

  return data;
};

export default singletonHook(undefined, useArrowData);
