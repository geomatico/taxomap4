import {useEffect, useMemo, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {Table, tableFromIPC} from 'apache-arrow';
import {FilterBy, TaxomapData, TaxonomicLevel} from '../types/common';
import {ARROW_COLUMN_MAPPING} from '../config';

const useArrowData = () => {
  const [arrowTable, setArrowTable] = useState<Table>();

  useEffect(() => {
    (tableFromIPC(fetch('data/taxomap_ultralite.arrow')) as unknown as Promise<Table>).then(setArrowTable);
  }, []);

  const data: TaxomapData | undefined = useMemo(() => {
    return arrowTable && {
      length: arrowTable.numRows,
      attributes: {
        getPosition: {
          value: arrowTable.getChild('geometry')?.getChildAt(0)?.data[0].values,
          size: 2
        }
      },
      ...Object.fromEntries(
        Object.entries(ARROW_COLUMN_MAPPING).map(([field, arrowKey]) => {
          const data = arrowTable.getChild(arrowKey)?.data[0].values;
          return [field, data];
        })
      ),
      id: arrowTable.getChild('id')?.toArray()
    } as TaxomapData;
  }, [arrowTable]);

  return data;
};

export default singletonHook(undefined, useArrowData);
