import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import { LbsMapProps } from "./ti-lbs-map-types";
import TiLbsMap from "./TiLbsMap.vue";

const en_us = {
  "com-name": "Map",
};
const zh_cn = {
  "com-name": "地图",
};

const COM_TYPE = COM_TYPES.LbsMap;

const TiLbsMapInfo: TiComInfo = {
  icon: "fas-map-location-dot",
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: "i18n:ti-lbs-map-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiLbsMap,
  install: (app: App) => {
    app.component(COM_TYPE, TiLbsMap);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {} as LbsMapProps,
    },
  ],
};

export * from "./ti-lbs-map-types";
export { TiLbsMap, TiLbsMapInfo };
