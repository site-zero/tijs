import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiButton from './TiButton.vue';
import { ButtonProps } from './ti-button-types';

const en_us = {
  'com-name': 'button',
  'example-simple-button': 'Simple Button',
  'example-with-color': 'With Color',
  'example-with-icon': 'With Icon',
  'example-with-args': 'With Payload',
  'example-use-i18n': 'Use i18n',
  'example-use-i18n-text': 'You saw a fire, and light has come',
};
const zh_cn = {
  'com-name': '按钮',
  'example-simple-button': '简单按钮',
  'example-with-color': '颜色按钮',
  'example-with-icon': '图标按钮',
  'example-with-args': '带参数按钮',
  'example-use-i18n': '国际化文字',
  'example-use-i18n-text': '你见了火焰，于是光明降临',
};

const COM_TYPE = COM_TYPES.Button;

const TiButtonInfo: TiComInfo = {
  icon: 'fas-hand-pointer',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-button-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiButton,
  install: (app: App) => {
    app.component(COM_TYPE, TiButton);
  },
  defaultProps: 'simple-button',
  exampleProps: [
    {
      name: 'simple-button',
      text: 'i18n:ti-button-example-simple-button',
      comConf: {},
    },
    {
      name: 'with-color',
      text: 'i18n:ti-button-example-with-color',
      comConf: {
        type: 'danger',
      } as ButtonProps,
    },
    {
      name: 'with-icon',
      text: 'i18n:ti-button-example-with-icon',
      comConf: {
        type: 'info',
        icon: 'zmdi-camera-roll',
        text: 'Take a photo',
        width: '180px',
        boxFontSize: 'b',
      } as ButtonProps,
    },
    {
      name: 'with-args',
      text: 'i18n:ti-button-example-with-args',
      comConf: {
        type: 'warn',
        icon: 'fas-igloo',
        text: 'Back To Home',
        minWidth: '180px',
        boxFontSize: 'b',
        payload: { lat: 23.123, lng: 113.456 },
      } as ButtonProps,
    },
    {
      name: 'use-i18n',
      text: 'i18n:ti-button-example-use-i18n',
      comConf: {
        type: 'success',
        icon: 'fas-fire-burner',
        text: 'i18n:ti-button-example-use-i18n-text',
        minWidth: '380px',
        boxFontSize: 'h',
        boxPadding: 'b',
        payload: 3.1415926,
      } as ButtonProps,
    },
  ],
};

export * from './ti-button-types';
export { TiButton, TiButtonInfo };
