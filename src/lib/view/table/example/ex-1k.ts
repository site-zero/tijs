import { TableCellProps, TableProps } from '../ti-table-types';
import { mockData } from './mock-table-row';

export default {
  name: '1k',
  text: 'i18n:ti-table-example-1k',
  comConf: (): TableProps => {
    return {
      className: 'fit-parent',
      columns: [
        {
          name: 'id',
        },
        {
          name: 'name',
        },
        {
          name: 'age',
        },
        {
          name: 'birthday',
        },
        {
          name: 'city',
        },
        {
          name: 'address',
        },
        {
          name: 'street',
        },
        {
          name: 'local_ip',
        },
      ] as TableCellProps[],
      data: mockData(1000),
    };
  },
};
