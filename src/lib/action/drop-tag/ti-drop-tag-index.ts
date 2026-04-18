import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiDropTag from "./TiDropTag.vue";
import { DropTagProps } from "./ti-drop-tag-types";

const en_us = {
  "com-name": "Drop Tag",
};
const zh_cn = {
  "com-name": "下拉标签",
  "example-only-icon": "仅图标",
  "example-with-tip": "带提示",
};

const COM_TYPE = COM_TYPES.DropTag;

const TiDropTagInfo: TiComInfo = {
  icon: "fas-tarp-droplet",
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: "i18n:ti-drop-tag-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiDropTag,
  install: (app: App) => {
    app.component(COM_TYPE, TiDropTag);
  },
  liveStyle: {
    position: "relative",
    width: "80%",
    minWidth: "100px",
    maxWidth: "300px",
    padding: "3em",
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "zh-cn",
        options: "#Languages",
        tipListMinWidth: "150px",
      } as DropTagProps,
    },
    {
      name: "only-icon",
      text: "i18n:ti-drop-tag-example-only-icon",
      comConf: {
        value: "auto-color-mode",
        options: "#ColorThemes",
        tipListMinWidth: "120px",
        boxFontSize: "b",
        hideText: true,
        hideTip: true,
      } as DropTagProps,
    },
    {
      name: "with-tip",
      text: "i18n:ti-drop-tag-example-with-tip",
      comConf: {
        value: "KG",
        options: "#Quantities",
        optionFilter: { type: "WEIGHT" },
        optionKeepRaw: true,
        tipListMinWidth: "350px",
        tipFormat: "VTP",
        tipItemTagStyles: {
          value: { width: "4em", color: "inherit" },
        },
        getTip: "type",
      } as DropTagProps,
    },
  ],
};

export * from "./ti-drop-tag-types";
export type { DropTagApi } from "./use-drop-tag-api";
export { TiDropTag, TiDropTagInfo };
