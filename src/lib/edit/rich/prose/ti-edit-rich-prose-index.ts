import { TiComInfo, TiComRace, TiEditRichProseProps } from "@site0/tijs";
import { App, defineAsyncComponent } from "vue";
import { COM_TYPES } from "../../../lib-com-types";
//import TiEditRichProse from "./TiEditRichProse.vue";
const COM_TYPE = COM_TYPES.EditRichProse;
const TiEditRichProse = defineAsyncComponent({
  loader: () => import("./TiEditRichProse.vue"),
  loadingComponent: {
    template: `<div>Loading ${COM_TYPE}.vue...</div>`,
  },
  errorComponent: {
    template: `<div>Fail to async load ${COM_TYPE}.vue</div>`,
  },
});

const en_us = {
  "com-name": "Rich Prose Editor",
};
const zh_cn = {
  "com-name": "富文本编辑器",
};

const TiEditRichProseInfo: TiComInfo = {
  icon: "fas-pen-to-square",
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: "i18n:ti-edit-rich-prose-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiEditRichProse,
  install: (app: App) => {
    app.component(COM_TYPE, TiEditRichProse);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {} as TiEditRichProseProps,
    },
  ],
};

export * from "./ti-edit-rich-prose-types";
export { TiEditRichProse, TiEditRichProseInfo };
