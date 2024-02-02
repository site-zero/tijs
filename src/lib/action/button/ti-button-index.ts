import { TiComInfo, TiComRace } from "../../";
import { App } from "vue";
import TiButton from "./TiButton.vue";

const en_us = {
  "com-name": "button"
};
const zh_cn = {
  "com-name": "按钮"
};

const TiButtonInfo: TiComInfo = {
  icon : "fas-hand-pointer",
  race: TiComRace.ACTION,
  name: "TiButton",
  text: "i18n:ti-button-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn
  },
  com: TiButton,
  install: (app: App) => {
    app.component("TiButton", TiButton);
  },
  defaultProps: "simple-button",
  exampleProps: [
    {
      name: "simple-button",
      comConf: {}
    }
  ]
};

export { TiButton, TiButtonInfo };