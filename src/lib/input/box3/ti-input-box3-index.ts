import { InputBoxProps, TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { MOCK_ANIMALS } from "./example/mock-animals";
import TiInputBox3 from "./TiInputBox3.vue";

const COM_TYPE = "TiInput";

const en_us = {
  "com-name": "Input Box",
  "example-formated": "Auto Upper",
  "example-lookup": "Suggest Options",
  "example-as-obj": "Object Value",
  "example-filter": "Filter Options",
  "example-query": "Dynamic Query",
  "example-open-copy": "Copy & Open",
  "example-droplist": "Readonly Dropdown",
};
const zh_cn = {
  "com-name": "输入框",
  "example-formated": "自动大写",
  "example-lookup": "提示选项",
  "example-as-obj": "对象值",
  "example-filter": "过滤选项",
  "example-query": "动态查询",
  "example-open-copy": "复制和打开",
  "example-droplist": "只读下拉",
};

const TiInputBox3Info: TiComInfo = {
  icon: "fas-keyboard",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputBox3,
  liveStyle: {
    width: "80%",
    minWidth: "120px",
    maxWidth: "500px",
    margin: "40px auto",
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
        valueCase: "upperAll",
        autoSelect: true,
      } as InputBoxProps,
    },
    {
      name: "open-copy",
      text: "i18n:ti-input-example-open-copy",
      comConf: {
        value: "vuejs.org",
        openLink: "https://${value}/",
        suffixIconFor: "open",
        prefixIconFor: "copy",
      } as InputBoxProps,
    },
    {
      name: "lookup",
      text: "i18n:ti-input-example-lookup",
      comConf: {
        value: undefined,
        valueCase: "upperAll",
        trimed: true,
        autoSelect: true,
        placeholder: "2 Digital Country Code",
        prefixIconFor: "clear",
        options: "#Countries",
        mustInOptions: true,
        tipFormat: "VT",
        tipShowTime: "auto",
        useTextWhenFocus: true,
        tipUseHint: false,
        tipListMinWidth: "320px",
        lookup: ["^~value", "^~text"],
      } as InputBoxProps,
    },
    {
      name: "as-obj",
      text: "i18n:ti-input-example-as-obj",
      comConf: {
        value: {
          value: "CNY",
        },
        valueType: "raw-item",
        valueCase: "upperAll",
        trimed: true,
        autoSelect: true,
        placeholder: "---",
        prefixIconFor: "clear",
        options: "#Currencies",
        mustInOptions: true,
        tipFormat: "VT",
        tipShowTime: "auto",
        useTextWhenFocus: true,
        tipUseHint: false,
        tipListMinWidth: "320px",
        lookup: ["^~value", "^~text"],
      } as InputBoxProps,
    },
    {
      name: "filter",
      text: "i18n:ti-input-example-filter",
      comConf: {
        value: undefined,
        valueCase: "upperAll",
        trimed: true,
        autoSelect: true,
        placeholder: "2 Digital QU",
        prefixIconFor: "clear",
        suffixIconFor: "load-options",
        options: "#Quantities",
        optionFilter: { type: "VOLUME" },
        optionKeepRaw: true,
        mustInOptions: true,
        tipShowTime: "auto",
        useTextWhenFocus: true,
        tipUseHint: false,
        tipFormat: "VpT",
        getDisplayText: "tip|text|value",
        tipListMinWidth: "420px",
        lookup: ["^~value", "^~text", "^~tip"],
      } as InputBoxProps,
    },
    {
      name: "query",
      text: "i18n:ti-input-example-query",
      comConf: {
        value: undefined,
        valueCase: "upperAll",
        trimed: true,
        autoSelect: true,
        placeholder: "Keyin for tips",
        prefixIconFor: "clear",
        suffixIconFor: "copy",
        mustInOptions: false,
        tipShowTime: "auto",
        useTextWhenFocus: true,
        tipUseHint: true,
        tipListMinWidth: "640px",
        options: "#hello100",
        lookup: ["*~text"],
      } as InputBoxProps,
    },
    {
      name: "droplist",
      text: "i18n:ti-input-example-droplist",
      comConf: {
        //value: null,
        trimed: false,
        placeholder: "Choose one Animal",
        type: "primary",
        boxFontSize: "s",
        prefixIconFor: "clear",
        suffixIconFor: "load-options",
        mustInOptions: true,
        autoPrefixIcon: true,
        canInput: false,
        options: MOCK_ANIMALS,
      } as InputBoxProps,
    },
  ],
};

export * from "./_fea";
export * from "./ti-input-box3-types";
export { TiInputBox3 as TiInput, TiInputBox3Info as TiInputInfo };
