import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiEditPairs from "./TiEditPairs.vue";
import { EditPairsProps } from "./edit-pairs-types";

const COM_TYPE = "TiEditPairs";

const en_us = {
  "com-name": "EditPairs",
};
const zh_cn = {
  "com-name": "名值对编辑",
  "example-groups": "分组",
  "example-tabs": "标签",
};

const TiEditPairsInfo: TiComInfo = {
  tags: ["ing"],
  icon: "fas-address-book",
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: "i18n:ti-edit-pairs-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiEditPairs,
  install: (app: App) => {
    app.component(COM_TYPE, TiEditPairsInfo);
  },
  liveStyle: {

  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: {
          name: "xiaobai",
          age: 12,
          website: "www.site0.xyz",
          actived: true
        },
      } as EditPairsProps,
    },
    {
      name: "groups",
      text: "i18n:ti-edit-pairs-example-groups",
      comConf: {
        valueMode: 'nested',
        formMode: 'group',
        value: {
          general: {
            name: "xiaobai",
            title: null,
            age: 12,
            website: "www.site0.xyz",
            actived: true
          },
          address: {
            city: 'Beijing',
            street: null,
            postcode: '10086',
            email: null,
            mobile: null,
            phone: null,
          },
          note: "xxx",
          comment: null
        },
      } as EditPairsProps,
    },
    {
      name: "tabs",
      text: "i18n:ti-edit-pairs-example-tabs",
      comConf: {
        value: {
          name: "xiaobai",
          age: 12,
          live: true
        },
      } as EditPairsProps,
    },
  ],
};

export * from "./edit-pairs-types";
export { TiEditPairs, TiEditPairsInfo };

