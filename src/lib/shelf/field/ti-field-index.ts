import { TiComInfo, TiComRace } from '../../';
import { App } from 'vue';
import TiField from './TiField.vue';
import { COM_TYPE } from './use-field';
//const TiField = defineAsyncComponent(() => import("./TiField.vue"));

const en_us = {
  'com-name': 'Field',
};
const zh_cn = {
  'com-name': '字段',
  'example-input': '输入',
};

const TiFieldInfo: TiComInfo = {
  icon: 'fas-feather',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-field-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiField,
  install: (app: App) => {
    app.component(COM_TYPE, TiField);
  },
  defaultProps: 'simple',
  exampleModel: {
    change: {
      key: 'data.${name}',
      val: '=value',
    },
  },
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        title: 'Name',
        name: 'name',
        data: {
          name: 'Peter',
          age: 45,
        },
      },
    },
    {
      name: 'input',
      text: 'i18n:ti-field-example-input',
      comConf: {
        title: 'Name',
        name: 'name',
        data: {
          name: 'Peter',
          age: 45,
        },
        comType: 'TiInput',
      },
    },
  ],
};

export { TiField, TiFieldInfo };
