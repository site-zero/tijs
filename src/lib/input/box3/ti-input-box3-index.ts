import { InputBox3Props, TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputBox3 from "./TiInputBox3.vue";

const COM_TYPE = "TiInputBox3";

const en_us = {
  "com-name": "Input Box 3",
};
const zh_cn = {
  "com-name": "输入框3",
  "example-options": "带选项",
  "example-formated": "自动大写",
  "example-query": "动态查询",
  "example-droplist": "只读下拉",
};

const TiInputBox3Info: TiComInfo = {
  icon: "fas-address-book",
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: "i18n:ti-input-box-3-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputBox3,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
    margin: "40px auto"
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputBox3Info);
  },
  defaultProps: "",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "Some Text",
      } as InputBox3Props,
    },
    {
      name: 'options',
      text: 'i18n:ti-input-box-3-example-options',
      comConf: {
        value: 'A',
        valueCase: 'upperAll',
        trimed: true,
        placeholder: 'Choose one options',
        prefixIconFor: 'clear',
        suffixIconFor: 'load-options',
        mustInOptions: true,
        lookup: ['*~text'],
        options: [
          { value: 'A', text: '甲' },
          { value: 'B', text: '乙' },
          { value: 'C', text: '丙' },
        ],
      } as InputBox3Props,
    }
  ],
};

export * from "./_fea";
export * from "./ti-input-box3-types";
export { TiInputBox3, TiInputBox3Info };
