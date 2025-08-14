import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { COM_TYPES } from "../../lib-com-types";
import TiDiffForm from "./TiDiffForm.vue";
import example from './example';

const en_us = {
  'com-name': 'Diff Form',
};
const zh_cn = {
  'com-name': '差异表单',
};

const COM_TYPE = COM_TYPES.DiffForm;

const TiDiffFormInfo: TiComInfo = {
  tags: ['ing'],
  icon: "fas-code-compare", // 从 fontawsome 寻找一个合适的图标
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: 'i18n:ti-diff-form-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiDiffForm,
  install: (app: App) => {
    app.component(COM_TYPE, TiDiffFormInfo);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from "./ti-diff-form-types";
export { TiDiffForm, TiDiffFormInfo };

