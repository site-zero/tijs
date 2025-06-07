import { App, defineAsyncComponent } from "vue";
import { TiComInfo, TiComRace } from "../../../../_type";
import { COM_TYPES } from "../../../lib-com-types";
import { atBottom, atTop } from "./example";

const COM_TYPE = COM_TYPES.LayoutTabs;
const TiLayoutTabs = defineAsyncComponent({
  loader: () => import("./TiLayoutTabs.vue"),
  loadingComponent: {
    template: `<div>Loading ${COM_TYPE}.vue...</div>`,
  },
  errorComponent: {
    template: `<div>Fail to async load ${COM_TYPE}.vue</div>`,
  },
});

const en_us = {
  "com-name": "Tabs Layout",
  "example-at-top": "Tabs At Top",
  "example-at-bottom": "Tabs At Bottom",
};
const zh_cn = {
  "com-name": "标签布局",
  "example-at-top": "标签组位于顶部",
  "example-at-bottom": "标签组位于底部",
};

const TiLayoutTabsInfo: TiComInfo = {
  icon: "zmdi-tab",
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: "i18n:ti-layout-tabs-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiLayoutTabs,
  liveStyle: {
    width: "100%",
    height: "100%",
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiLayoutTabs);
  },
  defaultProps: "at-top",
  exampleProps: [atTop, atBottom],
};

export * from "./ti-layout-tabs-types";
export { TiLayoutTabs, TiLayoutTabsInfo };
