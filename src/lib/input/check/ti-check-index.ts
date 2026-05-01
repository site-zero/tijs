import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiCheck from "./TiCheck.vue";

const en_us = {
  "com-name": "CheckBox",
  "example-customized-values": "Customized Values",
  "example-cus-number": "Customized Number",
  "example-cus-any": "Customized Any",
  "example-with-icon-tip": "Icon & Tip",
  "example-loading": "Loading...",
  "example-loading-tip": "Check box with customizable icon and text",
};
const zh_cn = {
  "com-name": "勾选框",
  "example-customized-values": "指定值",
  "example-cus-number": "指定数字",
  "example-cus-any": "指定任意值",
  "example-with-icon-tip": "带图标·提示",
  "example-loading": "加载中 ...",
  "example-loading-tip": "勾选框，可以随意指定按钮图标和文字",
};

const COM_TYPE = COM_TYPES.Check;

const TiCheckInfo: TiComInfo = {
  icon: "zmdi-check-square",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-check-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiCheck,
  install: (app: App) => {
    app.component(COM_TYPE, TiCheck);
  },
  liveStyle: {
    padding: "20px",
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: true,
        text: "hello",
      },
    },
    {
      name: "customized-values",
      text: "i18n:ti-check-example-customized-values",
      comConf: {
        value: "Hello",
        text: ["I said: 'Hello'", "I said: 'World'"],
        values: ["Hello", "World"],
      },
    },
    {
      name: "cus-number",
      text: "i18n:ti-check-example-cus-number",
      comConf: {
        value: 19,
        text: "Actived",
        values: [12, 19],
      },
    },
    {
      name: "cus-any",
      text: "i18n:ti-check-example-cus-any",
      comConf: {
        value: { color: "red" },
        text: "Actived",
        values: [{ color: "red" }, { age: 18 }],
      },
    },
    {
      name: "with-icon-tip",
      text: "i18n:ti-check-example-with-icon-tip",
      comConf: {
        value: true,
        type: "secondary",
        icon: "fas-spinner fa-spin",
        text: "i18n:ti-toggle-example-loading",
        tip: "i18n:ti-toggle-example-loading-tip",
        boxFontSize: "h",
      },
    },
  ],
};

export * from "./ti-check-types";
export { TiCheck, TiCheckInfo };
