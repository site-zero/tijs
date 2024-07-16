import { ComPropExample } from '../../../../_type';
import { GridFieldsProps } from '../ti-grid-fields-types';

export default {
  name: 'status',
  text: 'i18n:ti-grid-fields-example-status',
  comConf: {
    data: {
      id: 'Um5Cub2yX',
      name: 'Mahanta Lloyd',
      title: 'pamperedly schmitz enne',
      brief: 'Earthy numerably abulia globus rosinweed. ',
      client: '192.168.12.211',
      age: 32,
      role: 'staff',
      city: 'BeiJing',
      country: 'China',
      address: 'stuck-uppishness pteromalid',
    },
    title: 'Show Field Status',
    bodyPartDense: true,
    defaultComType: 'TiInput',
    fieldStatus: {
      name: { type: 'ok' },
      age: { type: 'error' },
      title: { type: 'warn' },
      client: { type: 'pending' },
      city: { type: 'pending' },
    },
    fields: [
      {
        title: 'ID',
        name: 'id',
        tip: 'This is ID',
        comType: 'TiLabel',
      },
      {
        title: 'Age',
        name: 'age',
        type: 'Integer',
        tip: 'This is Age',
      },
      {
        title: 'Name',
        name: 'name',
        tip: 'This is Name',
        required: true,
      },
      {
        title: 'Title',
        name: 'title',
        tip: 'This is Title',
        tipIcon: 'zmdi-face',
        disabled: {
          age: '[40,80]',
        },
      },
      {
        title: 'Brief',
        name: 'brief',
        tip: 'This is Brief',
        colSpan: 20,
      },
      {
        title: 'Client',
        name: 'client',
        tip: 'This is Client',
      },
      {
        title: 'Role',
        name: 'role',
        tip: 'This is Role',
      },
      {
        title: 'Email',
        name: 'email',
      },
      {
        title: 'Phone',
        name: 'phone',
        tip: 'This is Phone',
      },
      {
        title: 'Address',
        name: 'address',
      },
      {
        title: 'Location',
        name: ['city', 'country'],
        type: 'Object',
        tip: 'This is City',
        comType: 'TiLabel',
      },
    ],
  } as GridFieldsProps,
} as ComPropExample;
