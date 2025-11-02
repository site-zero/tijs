import { CrumbProps } from "../ti-crumb-types";

export default {
  name: "simple",
  text: "i18n:simple",
  comConf: {
    data: [
      { value: "a", text: "Animal", icon: "fas-paw" },
      { value: "dog", text: "Dog", icon: "fas-dog" },
      { value: "W_C", text: "Wang Cai", icon: "fas-shield-dog" },
    ],
    currentItemId: "W_C",
  } as CrumbProps,
};
