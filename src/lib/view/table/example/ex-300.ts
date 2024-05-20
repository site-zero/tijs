import { TableCellProps, TableProps } from '../ti-table-types';
import { mockData } from './mock-table-row';

export default {
  name: '300',
  text: 'i18n:ti-table-example-300',
  comConf: (): TableProps => {
    return {
      className: 'fit-parent',
      keepColumns: {
        keepAt: 'Ti-Demo-table-300k-columns',
      },
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
      data: mockData(300),
    };
  },
};
