import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { COM_TYPES } from "../../../lib-com-types";
import TiRichTinyMCEditor from "./TiRichTinyMCEditor.vue";
const COM_TYPE = COM_TYPES.RichTinyMCEditor;
// const TiRichTinyMCEditor = defineAsyncComponent({
//   loader: () => import("./TiRichTinyMCEditor.vue"),
//   loadingComponent: {
//     template: `<div>Loading ${COM_TYPE}.vue...</div>`,
//   },
//   errorComponent: {
//     template: `<div>Fail to async load ${COM_TYPE}.vue</div>`,
//   },
// });

const en_us = {
  "com-name": "TinyMCE",
};
const zh_cn = {
  "com-name": "TinyMCE",
};

const TiRichTinyMCEditorInfo: TiComInfo = {
  icon: "fas-file-lines", // 从 fontawsome 寻找一个合适的图标
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: "i18n:ti-rich-tiny-mc-editor-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiRichTinyMCEditor,
  install: (app: App) => {
    app.component(COM_TYPE, TiRichTinyMCEditorInfo);
  },
  defaultProps: "",
  exampleProps: [],
};

export * from "./ti-tiny-mc-editor-types";
export { TiRichTinyMCEditor, TiRichTinyMCEditorInfo };
