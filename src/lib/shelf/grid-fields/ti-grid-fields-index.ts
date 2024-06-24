import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiGridFields from './TiGridFields.vue';
import example from './example';
//console.log(JSON.stringify(example.simple.comConf))

const en_us = {
  'com-name': 'GridFields',
};
const zh_cn = {
  'com-name': '栅格字段组',
  'example-nested': '嵌套',
  'example-sameline': '整行字段',
  'example-editname': '编辑名称',
};

const COM_TYPE = COM_TYPES.GridFields;

const TiGridFieldsInfo: TiComInfo = {
  icon: 'zmdi-view-list',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-grid-fields-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiGridFields,
  liveStyle: {
    width: '100%',
    height: '100%',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiGridFields);
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.nested,
    example.sameline,
    example.editname,
  ],
  exampleModel: {
    change: {
      key: 'data',
      val: '=..',
      mode: 'assign',
    },
  },
};

export * from './ti-grid-fields-types';
export { TiGridFields, TiGridFieldsInfo };
