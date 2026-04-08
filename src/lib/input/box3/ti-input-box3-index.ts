import { InputBoxProps, TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputBox3 from "./TiInputBox3.vue";

const COM_TYPE = "TiInput";

const en_us = {
  "com-name": "Input Box",
};
const zh_cn = {
  "com-name": "输入框",
  "example-options": "带选项",
  "example-formated": "自动大写",
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
    maxWidth: "300px",
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
      } as InputBoxProps,
    },
    {
      name: "options",
      text: "i18n:ti-input-example-options",
      comConf: {
        value: "A",
        valueCase: "upperAll",
        trimed: true,
        placeholder: "Choose one options",
        prefixIconFor: "clear",
        suffixIconFor: "load-options",
        mustInOptions: true,
        lookup: ["*~text"],
        tipFormat: "VTP",
        options: [
          { value: "A", text: "甲" },
          { value: "B", text: "乙" },
          { value: "C", text: "丙" },
        ],
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
        value: "otter",
        trimed: false,
        placeholder: "Choose one Animal",
        type: "primary",
        boxFontSize: "t",
        prefixIconFor: "clear",
        suffixIconFor: "load-options",
        mustInOptions: true,
        autoPrefixIcon: true,
        canInput: false,
        options: [
          { value: "hippo", text: "Hippo", icon: "fas-hippo" },
          { value: "cow", text: "Cow", icon: "fas-cow" },
          { value: "spider", text: "Spider", icon: "fas-spider" },
          { value: "frog", text: "Frog", icon: "fas-frog" },
          { value: "bugs", text: "Bugs", icon: "fas-bugs" },
          { value: "otter", text: "Otter", icon: "fas-otter" },
          { value: "feather", text: "Feather", icon: "fas-feather" },
          { value: "fish", text: "Fish", icon: "fas-fish" },
          { value: "dragon", text: "Dragon", icon: "fas-dragon" },
          { value: "locust", text: "Locust", icon: "fas-locust" },
          { value: "dove", text: "Dove", icon: "fas-dove" },
          { value: "crow", text: "Crow", icon: "fas-crow" },
          { value: "dog", text: "Dog", icon: "fas-dog" },
          { value: "worm", text: "Worm", icon: "fas-worm" },
          { value: "shrimp", text: "Shrimp", icon: "fas-shrimp" },
          { value: "mosquito", text: "Mosquito", icon: "fas-mosquito" },
          { value: "horse", text: "Horse", icon: "fas-horse" },
          { value: "cat", text: "Cat", icon: "fas-cat" },
        ],
      } as InputBoxProps,
    },
  ],
};

export * from "./_fea";
export * from "./ti-input-box3-types";
export { TiInputBox3 as TiInput, TiInputBox3Info as TiInputInfo };
