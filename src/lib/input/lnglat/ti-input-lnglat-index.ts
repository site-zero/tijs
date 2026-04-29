import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import { InputLngLatProps } from "./ti-input-lnglat-types";
import TiInputLngLat from "./TiInputLngLat.vue";

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

const COM_TYPE = COM_TYPES.InputLngLat;

const TiInputLngLatInfo: TiComInfo = {
  icon: "fas-map-marker-alt",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-lng-lat-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputLngLat,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputLngLatInfo);
  },
  defaultProps: "drag",
  exampleProps: [
    {
      name: "drag",
      text: "i18n:ti-input-lng-lat-example-drag",
      comConf: {
        value: {
          lat: 39.968706,
          lng: 116.402893,
        },
        editPoint: "drag",
        canInput: false,
        mapOptions: {
          flyToOptions: true,
        },
      } as InputLngLatProps,
    },
    {
      name: "pin",
      text: "i18n:ti-input-lng-lat-example-pin",
      comConf: {
        editPoint: "pin",
        canInput: false,
        valueCoords: "GCJ02",
        valuePrecision: 8,
        mapOptions: {
          zoom: 15,
        },
      } as InputLngLatProps,
    },
    {
      name: "free",
      text: "i18n:ti-input-lng-lat-example-free",
      comConf: {
        editPoint: "drag",
        canInput: true,
        mapOptions: {
          keepZoomBy: "Demo-InputLngLat-Zoom",
        },
      } as InputLngLatProps,
    },
  ],
};

export * from "./ti-input-lnglat-types";
export { TiInputLngLat, TiInputLngLatInfo };
