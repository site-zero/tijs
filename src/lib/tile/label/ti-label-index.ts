import { LabelProps } from 'index';
import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiLabel from './TiLabel.vue';

const en_us = {
  'com-name': 'Label',
  'example-type-color': 'Type Color',
};
const zh_cn = {
  'com-name': '标签',
  'example-type-color': '类型颜色',
};

const COM_TYPE = COM_TYPES.Label;

const TiLabelInfo: TiComInfo = {
  icon: 'zmdi-label',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-label-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiLabel,
  install: (app: App) => {
    app.component(COM_TYPE, TiLabel);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        value: 'Hello Label',
      } as LabelProps,
    },
    {
      name: 'type-color',
      text: 'i18n:ti-label-example-type-color',
      comConf: {
        value: 'Hello Warn Label',
        type: 'warn',
        width: '200px'
      } as LabelProps,
    },
  ],
};

export * from './ti-label-types';
export { TiLabel, TiLabelInfo };
