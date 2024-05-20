import { TableCellProps, TableProps } from '../ti-table-types';
import { mockData } from './mock-table-row';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: (): TableProps => {
    return {
      className: 'fit-parent',
      keepColumns: {
        keepAt: 'Ti-Demo-table-simple-columns',
      },
      data: mockData(10),
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
    };
  },
};
