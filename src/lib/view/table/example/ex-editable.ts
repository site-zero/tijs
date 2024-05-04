import { TableCell } from '../../../';
import { mockData } from './mock-table-row';

export default {
  name: 'editable',
  text: 'i18n:ti-table-example-editable',
  comConf: () => {
    return {
      className: 'fit-parent',
      keepColumns: {
        keepAt: 'Ti-Demo-table-editable-columns',
      },
      columns: [
        {
          name: 'id',
        },
        {
          name: 'name',
          activatedComType: 'TiInput',
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
