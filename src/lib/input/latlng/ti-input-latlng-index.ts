import { App } from "vue";
import { InputLatLngProps } from "../../";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiInputLatLng from "./TiInputLatLng.vue";

const en_us = {
  "com-name": "Input Lat-Lng",
  "k-lat": "Lat",
  "k-lng": "Lng",
  "clear": "Clear current latitude and longitude settings",
  "edit": "Select latitude and longitude in the map editor",
  "example-drag": "Drag to edit",
  "example-pin": "Move to edit",
  "example-free": "Free edit",
};
const zh_cn = {
  "com-name": "经纬度",
  "k-lat": "纬度",
  "k-lng": "经度",
  "clear": "清除当前经纬度设置",
  "edit": "在地图编辑器中选取经纬度",
  "example-drag": "拖拽编辑",
  "example-pin": "移动编辑",
  "example-free": "自由编辑",
};

const COM_TYPE = COM_TYPES.InputLatLng;

const TiInputLatLngInfo: TiComInfo = {
  icon: "fas-map-marker-alt",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-lat-lng-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputLatLng,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputLatLngInfo);
  },
  defaultProps: "drag",
  exampleProps: [
    {
      name: "drag",
      text: "i18n:ti-input-lat-lng-example-drag",
      comConf: {
        editPoint: "drag",
        canInput: false,
      } as InputLatLngProps,
    },
    {
      name: "pin",
      text: "i18n:ti-input-lat-lng-example-pin",
      comConf: {
        editPoint: "pin",
        canInput: true,
      } as InputLatLngProps,
    },
    {
      name: "free",
      text: "i18n:ti-input-lat-lng-example-free",
      comConf: {
        editPoint: "drag",
        canInput: true,
      } as InputLatLngProps,
    },
  ],
};

export * from "./ti-input-latlng-types";
export { TiInputLatLng, TiInputLatLngInfo };
