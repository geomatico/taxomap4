import {useEffect, useMemo, useState} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {Table, tableFromIPC, Type, Vector} from 'apache-arrow';
import {TaxomapData} from '../commonTypes';
import {ARROW_FIELDS} from '../config';

const useArrowData = (): TaxomapData | undefined => {
  const [arrowTable, setArrowTable] = useState<Table>();

  useEffect(() => {
    (tableFromIPC(fetch('data/taxomap.arrow')) as unknown as Promise<Table>).then(setArrowTable);
  }, []);

  return useMemo(() => !arrowTable ? undefined : (
    {
      length: arrowTable.numRows,
      attributes: {
        getPosition: {
          value: arrowTable.getChild('geom')?.getChildAt(0)?.data[0].values,
          size: 2
        }
      },
      ...Object.fromEntries(ARROW_FIELDS.map(fieldName => {
        const fieldType: Type | undefined = arrowTable.schema.fields.find(({name}) => name === fieldName)?.type.typeId;
        const arrowData: Vector | null = arrowTable.getChild(fieldName);
        const data = fieldType == Type.Utf8 ? arrowData?.toArray() : arrowData?.data[0].values;
        return [fieldName, data];
      }))
    } as TaxomapData
  ), [arrowTable]);
};

export default singletonHook<TaxomapData | undefined>(undefined, useArrowData);
