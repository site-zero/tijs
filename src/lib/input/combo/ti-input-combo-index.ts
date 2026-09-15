import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputCombo from "./TiInputCombo.vue";
import { InputComboProps } from "./input-combo-types";

const COM_TYPE = "TiInputCombo";

const en_us = {
  "com-name": "Combo Input",
};
const zh_cn = {
  "com-name": "复合输入框",
};

const TiInputComboInfo: TiComInfo = {
  icon: "fas-address-book",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-combo-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputCombo,
  liveStyle: {
    width: "80%",
    minWidth: "120px",
    maxWidth: "500px",
    margin: "40px auto",
    overflow: "visible",
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputComboInfo);
  },

  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "Some Text",
        valueCase: "upperAll",
        autoSelect: true,
        showSizeWhen: "auto",
        showSizeAt: "top-right",
        forceShowSizeWhen: "fullsize",
        maxSize: 10,
      } as InputComboProps,
    },
  ],
};

export * from "./input-combo-types";
export { TiInputCombo, TiInputComboInfo };
