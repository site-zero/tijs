import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiToggle from "./TiToggle.vue";
import { ToggleProps } from "./ti-toggle-types";

const en_us = {
  "com-name": "Toggle",
  "example-for-int": "Number Value",
  "example-with-icon-text": "Icon & Text",
  "example-with-icon-tip": "Icon & Tip",
  "example-loading": "Loading...",
  "example-loading-tip": "Toggle button with customizable icon and text",
};
const zh_cn = {
  "com-name": "拨动开关",
  "example-for-int": "数字值",
  "example-with-icon-text": "带图标·文字",
  "example-with-icon-tip": "带图标·提示",
  "example-loading": "加载中 ...",
  "example-loading-tip": "开关按钮，可以随意指定按钮图标和文字",
};

const COM_TYPE = COM_TYPES.Toggle;

const TiToggleInfo: TiComInfo = {
  icon: "fas-toggle-off",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-toggle-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiToggle,
  install: (app: App) => {
    app.component(COM_TYPE, TiToggle);
  },
  liveStyle: {
    height: "300px",
    padding: "20px",
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {} as ToggleProps,
    },
    {
      name: "for-int",
      text: "i18n:ti-toggle-example-for-int",
      comConf: {
        value: 1,
        text: "Enable Check",
        type: "warn",
        boxFontSize: "t",
      } as ToggleProps,
    },
    {
      name: "with-icon-text",
      text: "i18n:ti-toggle-example-with-icon-text",
      comConf: {
        value: true,
        text: ["i18n:no", "i18n:yes"],
        icon: ["fas-radiation", "fas-check"],
        boxFontSize: "h",
      } as ToggleProps,
    },
    {
      name: "with-icon-tip",
      text: "i18n:ti-toggle-example-with-icon-tip",
      comConf: {
        style: {
          "--space": "-1px",
          "--off-left": "-1px",
          "--btn-size": "2em",
          "--box-width": "4em",
          "--box-height": "1em",
          "--icon-size": "1.3em",
        },
        value: 1,
        type: "secondary",
        icon: "fas-spinner fa-spin",
        text: "i18n:ti-toggle-example-loading",
        tip: "i18n:ti-toggle-example-loading-tip",
        boxFontSize: "h",
      } as ToggleProps,
    },
  ],
};

export * from "./ti-toggle-types";
export { TiToggle, TiToggleInfo };
