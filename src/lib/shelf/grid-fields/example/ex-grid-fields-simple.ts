import { ComPropExample } from '../../../../core';
import { GridFieldsProps } from '../ti-grid-fields-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    data: {
      id: 'Um5Cub2yX',
      name: 'Mahanta Lloyd',
      title: 'pamperedly schmitz enne',
      brief: 'Earthy numerably abulia globus rosinweed. ',
      client: '192.168.12.211',
      age: 32,
      role: 'staff',
      address: 'stuck-uppishness pteromalid',
    },
    defaultComType: 'TiInput',
    title: '<b style="color:red">Hello</b> world',
    titleType: 'html',

    bodyPartGap: 'b',
    bodyPartFontSize: 'm',
    layoutHint: '[[3,600],[2,400],1]',
    maxFieldNameWidth: 60,

    fields: [
      {
        title: 'Id',
        name: 'id',
        tip: 'This is ID',
        fieldLayoutMode: 'h-wrap',
        className: 'is-warn',
        fieldTitleBy: {
          comType: 'TiHtmlSnippet',
          comConf: {
            content: '<b>Hello</b> <i class="zmdi zmdi-info"></i>',
          },
        },
        comType: 'TiLabel',
      },
      {
        title: 'Age',
        name: 'age',
        type: 'Integer',
        tip: 'This is Age',
        fieldLayoutMode: 'h-bottom',
      },
      {
        title: 'Name',
        name: 'name',
        tip: 'This is Name',
        required: true,
        fieldLayoutMode: 'v-wrap',
      },
      {
        title: 'Title',
        name: 'title',
        tip: 'This is Title',
        tipIcon: 'zmdi-face',
        fieldLayoutMode: 'h-title-icon-prefix',
      },
      {
        title: 'Brief',
        name: 'brief',
        tip: 'This is Brief',
        fieldLayoutMode: 'h-title-icon-suffix',
        fieldTitleBy: {
          comType: 'TiInput',
        },
      },
      {
        title: 'Client',
        name: 'client',
        tip: 'This is Client',
        fieldLayoutMode: 'h-value-icon-prefix',
      },
      {
        title: 'Role',
        name: 'role',
        tip: 'This is Role',
        fieldLayoutMode: 'h-value-icon-suffix',
      },
      {
        title: 'Email',
        name: 'email',
        fieldLayoutMode: 'v-title-icon-prefix',
      },
      {
        title: 'Phone',
        name: 'phone',
        tip: 'This is Phone',
        fieldLayoutMode: 'v-title-icon-suffix',
      },
      {
        title: 'Address',
        name: 'address',
        fieldLayoutMode: 'v-value-icon-prefix',
      },
      {
        title: 'City',
        name: 'city',
        tip: 'This is City',
        fieldLayoutMode: 'v-value-icon-suffix',
      },
      {
        title: 'Country',
        name: 'country',
        tip: 'This is Country',
        fieldLayoutMode: 'h-wrap',
      },
      {
        title: 'Occupation',
        name: 'occupation',
        tip: 'This is Occupation',
        fieldLayoutMode: 'h-wrap',
      },
      {
        title: 'Company',
        name: 'company',
        tip: 'This is Company',
        fieldLayoutMode: 'v-wrap',
      },
      {
        title: 'Department',
        name: 'department',
        tip: 'This is Department',
        fieldLayoutMode: 'h-bottom',
        maxFieldNameWidth: 100,
      },
    ],
  } as GridFieldsProps,
} as ComPropExample;
