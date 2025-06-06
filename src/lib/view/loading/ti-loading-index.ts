import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiLoading from "./TiLoading.vue";

const en_us = {
  "com-name": "Loading",
  "example-simple-loading": "Simple Loading",
  "example-color-loading": "Color Loading",
};
const zh_cn = {
  "com-name": "加载标牌",
  "example-simple-loading": "简单加载标牌",
  "example-color-loading": "彩色加载标牌",
};

const COM_TYPE = COM_TYPES.Loading;

const TiLoadingInfo: TiComInfo = {
  icon: "fas-hourglass-half",
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: "i18n:ti-loading-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  liveStyle: {
    width: "100%",
    height: "100%",
  },
  com: TiLoading,
  install: (app: App) => {
    app.component(COM_TYPE, TiLoading);
  },
  defaultProps: "simple-loading",
  exampleProps: [
    {
      name: "simple-loading",
      text: "i18n:ti-loading-example-simple-loading",
      comConf: {},
    },
  ],
};

export { TiLoading, TiLoadingInfo };
