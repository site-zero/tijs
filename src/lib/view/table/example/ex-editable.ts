import { TableCell, TableProps } from '../../../';
import { mockData } from './mock-table-row';

export default {
  name: 'editable',
  text: 'i18n:ti-table-example-editable',
  comConf: (): TableProps => {
    return {
      className: 'fit-parent',
      keepColumns: {
        keepAt: 'Ti-Demo-table-editable-columns',
      },
      defaultCellActivatedComType: 'TiInput',
      defaultCellActivatedComConf: {
        hideBorder: true,
        autoSelect: false,
        boxFocused: true,
      },
      columns: [
        {
          name: 'id',
          activatedComType: null,
          comConf: {
            className:"is-nowrap is-disable"
          }
        },
        {
          name: 'name',
          activatedComType: 'TiInput',
          activatedComConf: {
            hideBorder: true,
            autoSelect: false,
            boxFocused: true,
          },
        },
        {
          name: 'age',
          activatedComType: null,
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
