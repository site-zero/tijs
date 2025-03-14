import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiMultiDroplist from './TiMultiDroplist.vue';
import example from './example';

const en_us = {
  'com-name': 'Multi-Droplist',
};
const zh_cn = {
  'com-name': '多选下拉框',
  'example-with-icon': '选项带图标',
  'example-with-tip': '选项带备注',
  'example-multi-with-icon': '多选带图标',
  'example-multi-with-tip': '多选带备注',
};

const COM_TYPE = COM_TYPES.MultiDroplist;

const TiMultiDroplistInfo: TiComInfo = {
  icon: 'fas-check-double',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-multi-droplist-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiMultiDroplist,
  liveStyle: {
    display: 'block',
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiMultiDroplist);
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.withIcon,
    example.withTip,
    // example.multiWithIcon,
    // example.multiWithTip,
  ],
};

export * from './ti-multi-droplist-types';
export { TiMultiDroplist, TiMultiDroplistInfo };
