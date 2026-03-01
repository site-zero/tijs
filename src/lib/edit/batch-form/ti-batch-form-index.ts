import { TiBatchFormProps, TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiBatchForm from "./TiBatchForm.vue";

const COM_TYPE = "TiBatchForm";

const en_us = {
  "com-name": "Batch Form",
};
const zh_cn = {
  "com-name": "批量表单",
};

const TiBatchFormInfo: TiComInfo = {
  icon: "zmdi-assignment-check",
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: "i18n:ti-batch-form-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiBatchForm,
  install: (app: App) => {
    app.component(COM_TYPE, TiBatchFormInfo);
  },
  exampleModel: {
    change: {
      key: "data",
      val: "=..",
      mode: "assign",
    },
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        layoutHint: 1,
        fields: [
          "#INPUT=name/Name",
          "#INPUT-INT=age/Age",
          "#TOGGLE=is_admin/Is Admin",
        ],
      } as TiBatchFormProps,
    },
  ],
};

export * from "./ti-batch-form-types";
export { TiBatchForm, TiBatchFormInfo };

export * from "./name/batch-form-name-index";
