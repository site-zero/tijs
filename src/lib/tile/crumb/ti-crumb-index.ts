import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { COM_TYPES } from "../../lib-com-types";
import TiCrumb from "./TiCrumb.vue";
import * as example from "./example/index";

const COM_TYPE = COM_TYPES.Crumb;

const en_us = {
  "com-name": "TiCrumb",
  "example-with-icon": "With Icon",
  "example-with-head": "With Head",
};
const zh_cn = {
  "com-name": "面包屑导航条",
  "example-with-icon": "带图标",
  "example-with-head": "定制头部",
};

const TiCrumbInfo: TiComInfo = {
  icon: "fas-angles-right",
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: "i18n:ti-crumb-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiCrumb,
  install: (app: App) => {
    app.component(COM_TYPE, TiCrumbInfo);
  },
  defaultProps: "simple",
  exampleProps: [example.simple, example.withIcon, example.withHead],
  exampleModel: (eventName: string, payload: any) => {
    console.log("example::click-button", { eventName, payload });
  },
};

export * from "./ti-crumb-types";
export { TiCrumb, TiCrumbInfo };
