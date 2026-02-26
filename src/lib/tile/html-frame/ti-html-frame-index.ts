import { App } from "vue";
import { TiComInfo, TiComRace } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiHtmlFrame from "./TiHtmlFrame.vue";

const COM_TYPE = COM_TYPES.HtmlFrame;

const en_us = {
  "com-name": "Html Frame",
};
const zh_cn = {
  "com-name": "HTML框架",
};

const TiHtmlFrameInfo: TiComInfo = {
  icon: "fas-file-code",
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: "i18n:ti-html-frame-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiHtmlFrame,
  install: (app: App) => {
    app.component(COM_TYPE, TiHtmlFrameInfo);
  },
  liveStyle: {
    width: "100%",
    maxWidth: "unset",
    height: "100%",
    padding: "20px",
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: `<h1>Heading</h1><ul><li>item 1</li><li>item 2</li></ul>`,
      },
    },
  ],
};

export * from "./ti-html-frame-types";
export { TiHtmlFrame, TiHtmlFrameInfo };
