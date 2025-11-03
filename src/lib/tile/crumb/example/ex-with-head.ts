import { ButtonProps } from "../../../";
import { CrumbProps } from "../ti-crumb-types";

export default {
  name: "with-head",
  text: "i18n:ti-crumb-example-with-head",
  comConf: {
    head: {
      comType: "TiButton",
      comConf: {
        text:"Click Me ^_^",
        action: "click-button",
      } as ButtonProps,
      events: {
        "click-button": true,
      },
    },
    type: "danger",
    data: [
      { value: "a", text: "Animal", icon: "fas-paw" },
      { value: "dog", text: "Dog", icon: "fas-dog" },
      { value: "W_C", text: "Wang Cai", icon: "fas-shield-dog" },
    ],
    value: "W_C",
  } as CrumbProps,
};
