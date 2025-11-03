import { CrumbProps } from "../ti-crumb-types";

export default {
  name: "with-icon",
  text: "i18n:ti-crumb-example-with-icon",
  comConf: {
    itemFontSize: "m",
    itemPadding: "m",
    itemRadius: "m",
    type:"success",
    data: [
      { value: "a", text: "Animal", icon: "fas-paw" },
      { value: "dog", text: "Dog", icon: "fas-dog" },
      { value: "W_C", text: "Wang Cai", icon: "fas-shield-dog" },
    ],
    value: "W_C",
  } as CrumbProps,
};
