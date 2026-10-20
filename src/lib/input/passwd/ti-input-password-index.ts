import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { COM_TYPES } from "../../lib-com-types";
import TiInputPassword from "./TiInputPassword.vue";
import { InputPasswordProps } from "./ti-input-password-types";

const COM_TYPE = COM_TYPES.InputPassword;

const en_us = {
  "com-name": "Password Input",
  "lvl1": "Very Weak",
  "lvl2": "Weak",
  "lvl3": "Normal",
  "lvl4": "Strong",
  "lvl5": "Very Strong",
  // "lvl1": "VW",
  // "lvl2": "Wk",
  // "lvl3": "Norm",
  // "lvl4": "Str",
  // "lvl5": "VS",
};
const zh_cn = {
  "com-name": "密码输入框",
  "lvl1": "很弱",
  "lvl2": "较弱",
  "lvl3": "一般",
  "lvl4": "强",
  "lvl5": "很强",
};

const TiInputPasswordInfo: TiComInfo = {
  icon: "zmdi-lock",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-password-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputPassword,
  liveStyle: {
    width: "80%",
    minWidth: "120px",
    maxWidth: "500px",
    margin: "40px auto",
    overflow: "visible",
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputPassword);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "",
        placeholder: "Please input password",
      } as InputPasswordProps,
    },
  ],
};

export * from "./ti-input-password-types";
export { TiInputPassword, TiInputPasswordInfo };
