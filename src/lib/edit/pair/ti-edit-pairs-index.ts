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
  liveStyle: {},
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
          actived: true,
        },
      } as EditPairsProps,
    },
    {
      name: "groups",
      text: "i18n:ti-edit-pairs-example-groups",
      comConf: {
        formMode: "form",
        groups: [
          { text: "General", value: "g", fields: ["general.*"] },
          { text: "Address", value: "a", fields: ["address.*"] },
          { text: "Other", value: "o", fields: ["*"] },
        ],
        value: {
          general: {
            name: "xiaobai",
            title: "XiaoBai",
            age: 12,
            website: "www.site0.xyz",
            actived: true,
          },
          address: {
            city: "Beijing",
            street: "My Home Is Here",
            postcode: "10086",
            email: "zozoh@site0.xyz",
            mobile: "13910110054",
            phone: "88765543",
          },
          note: "xxx",
          comment: "hello world",
        },
      } as EditPairsProps,
    },
    {
      name: "tabs",
      text: "i18n:ti-edit-pairs-example-tabs",
      comConf: {
        formMode: "tabs",
        groups: [
          { text: "General", value: "g", fields: ["general.*"] },
          { text: "Address", value: "a", fields: ["address.*"] },
          { text: "Other", value: "o", fields: ["*"] },
        ],
        value: {
          general: {
            name: "xiaobai",
            title: "XiaoBai",
            age: 12,
            website: "www.site0.xyz",
            actived: true,
          },
          address: {
            city: "Beijing",
            street: "My Home Is Here",
            postcode: "10086",
            email: "zozoh@site0.xyz",
            mobile: "13910110054",
            phone: "88765543",
          },
          note: "xxx",
          comment: "hello world",
        },
      } as EditPairsProps,
    },
  ],
};

export * from "./edit-pairs-types";
export { TiEditPairs, TiEditPairsInfo };
