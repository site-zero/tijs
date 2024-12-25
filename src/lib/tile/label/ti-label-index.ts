import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import { LabelProps } from './ti-label-types';
import TiLabel from './TiLabel.vue';

const en_us = {
  'com-name': 'Label',
  'example-type-color': 'Type Color',
  'example-with-icon': 'With Icon',
  'example-with-href': 'With Href',
};
const zh_cn = {
  'com-name': '标签',
  'example-type-color': '类型颜色',
  'example-with-icon': '带图标',
  'example-with-href': '带超链接',
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
        value: 'Hello Color Label Hello Color Label Hello Color Label',
        width: '200px',
        type: 'info',
        nowrap: true,
        showBorder: true,
        colorMode: 'box',
        boxRadius: 'm',
        boxFontSize: 'm',
        boxPadding: 'b',
      } as LabelProps,
    },
    {
      name: 'with-icon',
      text: 'i18n:ti-label-example-with-icon',
      comConf: {
        value: 'Hello Icon Label',
        //type: 'primary',
        nowrap: true,
        showBorder: true,
        colorMode: 'text',
        prefixIcon: 'zmdi-cake',
        prefixIconFor: 'clear',
        suffixIcon: 'zmdi-apple',
        suffixIconFor: 'copy',
        width: '200px',
        placeholder: 'without value'
      } as LabelProps,
    },
    {
      name: 'with-href',
      text: 'i18n:ti-label-example-with-href',
      comConf: {
        value: 'Lookup Hello',
        //type: 'primary',
        href: 'https://bing.com/search?q=${value}'
      } as LabelProps,
    },
  ],
};

export * from './ti-label-types';
export { TiLabel, TiLabelInfo };
