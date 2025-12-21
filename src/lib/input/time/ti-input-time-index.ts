import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiInputTime from "./TiInputTime.vue";
import { InputTimeProps } from "./ti-input-time-types";

const en_us = {
  "com-name": "Time Box",
  "example-sec": "To Seconds",
  "example-big": "Big Font",
};
const zh_cn = {
  "com-name": "时间框",
  "example-sec": "精确到秒",
  "example-big": "大字体",
};

const COM_TYPE = COM_TYPES.InputTime;

const TiInputTimeInfo: TiComInfo = {
  /**
   * 组件标签，用于分类和筛选
   * scaffold 标签表示该组件处于脚手架状态，可能需要进一步开发完善
   */
  icon: "zmdi-time",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-time-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputTime,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputTime);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "09:15",
      } as InputTimeProps,
    },
    {
      name: "sec",
      text: "i18n:ti-input-time-example-sec",
      comConf: {
        value: "12:34:56",
        timeMode: "sec",
      } as InputTimeProps,
    },
    {
      name: "big",
      text: "i18n:ti-input-time-example-big",
      comConf: {
        value: "09:15",
        timeMode: "sec",
        input: {
          boxFontSize: "h",
          boxPadding: "m",
          width: "3em",
        },
      } as InputTimeProps,
    },
  ],
};

export * from "./ti-input-time-types";
export { TiInputTime, TiInputTimeInfo };
