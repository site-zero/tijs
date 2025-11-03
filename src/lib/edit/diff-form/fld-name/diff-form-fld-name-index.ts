import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { COM_TYPES } from "../../../lib-com-types";
import DiffFormFldName from "./DiffFormFldName.vue";

const COM_TYPE = COM_TYPES.DiffFormFldName;

const DiffFormFldNameInfo: TiComInfo = {
  icon: "zmdi-label-alt-outline",
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: COM_TYPE,
  i18n: {
    en_uk: {},
    en_us: {},
    zh_cn: {},
    zh_hk: {},
  },
  com: DiffFormFldName,
  install: (app: App) => {
    app.component(COM_TYPE, DiffFormFldNameInfo);
  },
  defaultProps: "",
  exampleProps: [],
};

export * from "./diff-form-fld-name-types";
export { DiffFormFldName, DiffFormFldNameInfo };
