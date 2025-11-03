import { CrumbProps } from "../ti-crumb-types";

export default {
  name: "simple",
  text: "i18n:simple",
  comConf: {
    itemFontSize: "m",
    itemPadding: "m",
    itemRadius: "m",
    type: "success",
    data: [
      { value: "plant", text: "Plant" },
      { value: "tree", text: "Tree" },
      { value: "pine", text: "Pine Tree" },
    ],
    value: null,
  } as CrumbProps,
};
