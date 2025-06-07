import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiRadioList from './TiRadioList.vue';
import example from './example';

const en_us = {
  'com-name': 'Radio List',
  'example-with-icon': 'With Icon',
  'example-with-tip': 'With Tip',
};
const zh_cn = {
  'com-name': '单选列表',
  'example-with-icon': '带图标列表',
  'example-with-tip': '带备注列表',
};

const COM_TYPE = COM_TYPES.RadioList;

const TiRadioListInfo: TiComInfo = {
  icon: 'zmdi-dot-circle-alt',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-radio-list-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiRadioList,
  liveStyle: {
    width: "100%",
    height: "100%",
    maxWidth: "unset",
    position: "unset",
    display: "block",
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiRadioList);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.with_icon, example.with_tip],
};

export * from './ti-radio-list-types';
export { TiRadioList, TiRadioListInfo };
