import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../';
import TiInput from './TiInput.vue';
import { COM_TYPE } from './use-input-box';

const en_us = {
  'com-name': 'InputBox',
};
const zh_cn = {
  'com-name': '输入框',
  'example-options': '带选项',
};

const TiInputInfo: TiComInfo = {
  icon: 'fas-i-cursor',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInput,
  install: (app: App) => {
    app.component(COM_TYPE, TiInput);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        //className: "",
        value: 'Some Text',
        prefixIconForClean: true,
        // prefixIcon :"zmdi-close",
        // prefixText : "前置文本",
        // suffixText : "后置文本",
        // suffixIcon :"zmdi-windows",
        // prefixIconClickable:true,
        // prefixTextClickable:true,
        // suffixIconClickable:true,
        // suffixTextClickable:true,
      },
    },
    {
      name: 'options',
      text: 'i18n:ti-input-example-options',
      comConf: {
        //className: "",
        format: '【${val}】',
        value: 'A',
        valueCase: 'upper',
        trimed: true,
        placeholder: 'Choose one options',
        prefixIconForClean: true,
        suffixIconForCopy: true,
        mustInOptions: true,
        options: {
          data: [
            { value: 'A', text: '甲' },
            { value: 'B', text: '乙' },
            { value: 'C', text: '丙' },
          ],
        },
      },
    },
  ],
};

export { TiInput, TiInputInfo };
