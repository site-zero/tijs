import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import TiLabel from './TiLabel.vue';

const en_us = {
  'com-name': 'Label',
  'example-prefix-suffix': 'Prefix-Suffix',
};
const zh_cn = {
  'com-name': '标签',
  'example-prefix-suffix': '前缀后缀',
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
        className: '',
        value: 'New Label',
      },
    },
    {
      name: 'warn',
      text: 'i18n:warn',
      comConf: {
        className: 'is-warn-r',
        value: 'New Label',
      },
    },
    {
      name: 'color',
      text: 'i18n:example-color',
      comConf: {
        className: '',
        value: 'New Label',
        style: {
          color: '#08F',
        },
      },
    },
    {
      name: 'nil',
      text: 'i18n:example-nil',
      comConf: {
        value: null,
        placeholder: 'i18n:none',
      },
    },
    {
      name: 'prefix-suffix',
      text: 'i18n:ti-label-example-prefix-suffix',
      comConf: {
        value: 'Label Content',
        prefixIcon: 'fas-cart-arrow-down',
        prefixText: 'check',
        suffixText: 'more',
        suffixIcon: 'fas-arrow-alt-circle-down',

        prefixIconClickable: true,
        prefixTextClickable: true,
        suffixTextClickable: true,
        suffixIconClickable: true,

        suffixHoverIcon: 'fas-mask',
        prefixHoverIcon: 'fas-heart',
        prefixHoverText: 'haha',
        suffixHoverText: '---',
      },
    },
    {
      name: 'customized',
      text: 'i18n:customized',
      comConf: {
        value: 'Label Content',
        prefixIcon: 'fas-cart-arrow-down',
        prefixText: 'check',
        suffixText: 'more',
        suffixIcon: 'fas-arrow-alt-circle-down',

        prefixIconClickable: true,
        prefixTextClickable: true,
        suffixTextClickable: true,
        suffixIconClickable: true,

        suffixHoverIcon: 'fas-mask',
        prefixHoverIcon: 'fas-heart',
        prefixHoverText: 'haha',
        suffixHoverText: '---',

        prefixStyle: {
          background: 'red',
          borderRadius: '5px',
        },
        suffixStyle: {
          background: '#f0f',
          borderRadius: '5px',
        },

        prefixIconStyle: {
          color: '#ff0',
        },
        prefixTextStyle: {
          color: '#FFF',
          fontWeight: 'bold',
        },

        suffixIconStyle: {
          color: '#ff0',
        },
        suffixTextStyle: {
          color: '#FFF',
          fontWeight: 'bold',
        },
      },
    },
  ],
};

export { TiLabel, TiLabelInfo };
export * from './ti-label-types';
