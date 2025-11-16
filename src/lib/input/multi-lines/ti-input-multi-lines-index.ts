import { TiComInfo, TiComRace, TiInputMultiLinesProps } from "@site0/tijs";
import { App } from "vue";
import TiInputMultiLines from "./TiInputMultiLines.vue";

const COM_TYPE = "TiInputMultiLines";

const en_us = {
  "com-name": "TiInputMultiLines",
};
const zh_cn = {
  "com-name": "多行输入框",
};

const TiInputMultiLinesInfo: TiComInfo = {
  tags: ["ing"],
  icon: "fas-align-left",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-multi-lines-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputMultiLines,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputMultiLinesInfo);
  },
  liveStyle: {
    minWidth: "200px",
    width: "90%",
  },
  defaultProps: "",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "Rose,Tulip,Sunflower",
        emptyAsNull: false,
        autoFilterNilItem: true,
      } as TiInputMultiLinesProps,
    },
  ],
};

export * from "./ti-input-multi-lines-types";
export { TiInputMultiLines, TiInputMultiLinesInfo };
