import { ComPropExample, IconInput } from '../../../../core';
import { GridFieldsProps } from '../ti-grid-fields-types';

export default {
  name: 'editname',
  text: 'i18n:ti-grid-fields-example-editname',
  comConf: {
    data: {
      name: 'Mahanta Lloyd',
      age: 32,
      title: 'pamperedly schmitz enne',
      brief: 'Earthy numerably abulia globus rosinweed. ',
      city: 'BeiJing',
      phone: '+86 13910110054',
      address: 'stuck-uppishness pteromalid',
    },
    bodyPartGap: 't',
    bodyPartFontSize: 'b',
    layoutHint: 1,
    maxFieldNameWidth: 120,
    fieldLayoutMode: 'h-wrap',
    defaultFieldTitleBy: {
      comType: 'TiInput',
      comConf: {
        value: '=name',
        format: '=title',
        prefixIcon: function (payload: any): IconInput | undefined {
          if (payload.required) {
            return {
              type: 'font',
              className: 'is-error-r',
              value: 'zmdi-alert-polygon',
            };
          }
        },
      },
    },
    fields: [
      {
        title: 'Name',
        name: 'name',
        required: true,
        comType: 'TiInput',
      },
      {
        title: 'Age',
        name: 'age',
        type: 'Integer',
        comType: 'TiInput',
      },
      {
        title: 'Title',
        name: 'title',
        comType: 'TiInput',
      },
      {
        title: 'Brief',
        name: 'brief',
        comType: 'TiInput',
      },
      {
        title: 'City',
        name: 'city',
        comType: 'TiInput',
      },
      {
        title: 'Phone',
        name: 'phone',
        comType: 'TiInput',
      },
      {
        title: 'Address',
        name: 'address',
        comType: 'TiInput',
      },
    ],
  } as GridFieldsProps,
} as ComPropExample;
