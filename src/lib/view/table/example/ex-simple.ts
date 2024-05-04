import { TableCell } from '../../../';
import { mockData } from './mock-table-row';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: () => {
    return {
      className: 'fit-parent',
      keepColumns: {
        keepAt: 'Ti-Demo-table-simple-columns',
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
      ] as TableCell[],
      data: mockData(10),
    };
  },
};
