import { InputBoxProps } from '../../../';
import { TableCellProps, TableProps } from '../ti-table-types';
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
        autoSelect: true,
        autoFocus: true,
      },
      data: mockData(10),
      columns: [
        {
          name: 'id',
          activatedComType: null,
          comConf: {
            className: 'is-nowrap is-disable',
          },
        },
        {
          name: 'name',
          activatedComType: 'TiInput',
          activatedComConf: {
            hideBorder: true,
            autoSelect: true,
            autoFocus: true,
          } as InputBoxProps,
        },
        {
          name: 'age',
          type: 'Integer',
        },
        {
          name: 'birthday',
          activatedComType: null,
          comConf: {
            className: 'is-nowrap is-disable',
          },
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
