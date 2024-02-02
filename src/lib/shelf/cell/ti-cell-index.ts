import { TiComInfo, TiComRace } from "../../";
import { App } from "vue";
import TiCell from "./TiCell.vue";
import { COM_TYPE } from "./use-cell";
//const TiCell = defineAsyncComponent(() => import("./TiCell.vue"));

const en_us = {
  "com-name": "Cell",
  "example-input": "Input"
};
const zh_cn = {
  "com-name": "单元格",
  "example-input": "输入"
};

const TiCellInfo: TiComInfo = {
  icon: "zmdi-border-style",
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: "i18n:ti-cell-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn
  },
  com: TiCell,
  install: (app: App) => {
    app.component(COM_TYPE, TiCell);
  },
  defaultProps: "simple",
  exampleModel: {
    "change": {
      key: "data.${name}",
      val: "=value"
    }
  },
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        title: "Name",
        name: "name",
        data: {
          name: "Peter",
          age: 45
        }
      }
    },
    {
      name: "input",
      text: "i18n:ti-cell-example-input",
      comConf: {
        title: "Name",
        name: "name",
        data: {
          name: "Peter",
          age: 45
        },
        comType: "TiInput"
      }
    }
  ]
};

export { TiCell, TiCellInfo };