import {tableFromIPC, Table, Type, Vector} from 'apache-arrow';
import {ARROW_FIELDS, STATIC_RESOURCES_HOST} from '../../config';
import {TaxomapData} from '../../commonTypes';

export const PATH = `${STATIC_RESOURCES_HOST}/static/taxomap.arrow`;

const getTaxomapData = async (): Promise<TaxomapData | undefined> => {
  const table = await tableFromIPC(fetch(PATH));
  return !table ? undefined : toTaxomapData(table);
};

// for use in test data
export const toTaxomapData = (arrowTable: Table) => ({
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
    const data = fieldType === Type.Utf8 ? arrowData?.toArray() : arrowData?.data[0].values;
    return [fieldName, data];
  }))
}) as TaxomapData;

export default getTaxomapData;
