import { TiComInfo, TiComRace } from "../../../";
import { App } from "vue";
import TiLayoutTabs from "./TiLayoutTabs.vue";
import { nested, simple } from "./example";
import i18n from "./i18n";
import { COM_TYPE } from "./use-layout-tabs";

const TiLayoutTabsInfo: TiComInfo = {
  icon: "zmdi-tab",
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: "i18n:ti-layout-tabs-com-name",
  i18n,
  com: TiLayoutTabs,
  install: (app: App) => {
    app.component(COM_TYPE, TiLayoutTabs);
  },
  defaultProps: "simple",
  exampleProps: [simple, nested]
};

export { TiLayoutTabs, TiLayoutTabsInfo };