import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputTime from './TiInputTime.vue';
import example from './example';

const en_us = {
  'com-name': 'Time Box',
};
const zh_cn = {
  'com-name': '时间框',
};

const COM_TYPE = COM_TYPES.InputTime;

const TiInputTimeInfo: TiComInfo = {
  /**
   * 组件标签，用于分类和筛选
   * scaffold 标签表示该组件处于脚手架状态，可能需要进一步开发完善
   */
  tags: ['scaffold'],
  icon: 'zmdi-time',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-time-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputTime,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputTime);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-time-types';
export { TiInputTime, TiInputTimeInfo };
