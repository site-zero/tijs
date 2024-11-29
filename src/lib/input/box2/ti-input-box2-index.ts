import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInput2 from './TiInput2.vue';
import example from './example';

const en_us = {
  'com-name': 'InputBox2',
};
const zh_cn = {
  'com-name': '输入框v2',
  'example-options': '带选项',
  'example-formated': '格式显示值',
  'example-query': '动态查询',
  'example-droplist': '只读下拉',
};

const COM_TYPE = 'TiInput2';

const TiInput2Info: TiComInfo = {
  tags: ['ing'],
  icon: 'fas-i-cursor',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-2-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInput2,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInput2);
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.formated,
    example.options,
    example.query,
    example.droplist,
  ],
};

export { TiInput2, TiInput2Info };
export * from './ti-input-box2-types';
