import { ActionBarItem } from "../../../../../../";

export default {
  icon: "zmdi-format-bold",
  tip: "i18n:bold",
  altDisplay: {
    test: { bold: true },
    className: "highlight",
  },
  action: {
    name: "toggleMark",
    payload: {
      mark: "bold",
    },
  },
} as ActionBarItem;
