import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import { LbsMapProps } from "./ti-lbs-map-types";
import TiLbsMap from "./TiLbsMap.vue";

const en_us = {
  "com-name": "Map",
  "example-dragpoint": "Dragable Point",
  "example-multi-markers": "Multi Markers",
};
const zh_cn = {
  "com-name": "地图",
  "example-dragpoint": "可拖拽点",
  "example-multi-markers": "多个标记点",
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
    //------------------- 简单
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        valueCoords: "WGS84",
        zoom: 12,
        watchForInit: true,
        value: {
          lat: 39.907576,
          lng: 116.391275,
        },
        valueType: "obj",
      } as LbsMapProps,
    },
    //------------------- 可拖拽点
    {
      name: "dragpoint",
      text: "i18n:ti-lbs-map-example-dragpoint",
      comConf: {
        valueCoords: "GCJ02",
        zoom: 12,
        value: {
          // lat: 39.907576,
          // lng: 116.391275,
          lat: 40.03235902939368,
          lng: 116.33976545657697,
        },
        valueType: "obj",
        editPoint: "drag",
        showInfo: {
          zoom: true,
          center: true,
          pointerHover: true,
        },
      } as LbsMapProps,
    },
    //------------------- 多个标记点
    {
      name: "multi-markers",
      text: "i18n:ti-lbs-map-example-multi-markers",
      comConf: {
        valueCoords: "GCJ02",
        zoom: 12,
        value: [
          // 鸟巢
          { lat: 39.9987, lng: 116.4026 },
          // 颐和园（东宫门）
          { lat: 39.907576, lng: 116.391275 },
          // 天坛
          { lat: 39.916667, lng: 116.397222 },
          // 北京站
          { lat: 39.904722, lng: 116.407222 },
        ],
        valueType: "obj-list",
        displayType: "Point",
        // 这里用来设置marker 图标具体样式
        markerOptions: {

        },
        watchForInit: true,
        autoFitBounds: true,
        showInfo: {
          zoom: true,
          center: true,
          pointerHover: true,
        },
      } as LbsMapProps,
    },
  ],
};

export * from "./ti-lbs-map-types";
export { TiLbsMap, TiLbsMapInfo };
