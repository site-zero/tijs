import { ActionBarItem } from "../../../../../../";

export default {
  icon: "zmdi-format-bold",
  tip: "i18n:bold",
  altDisplay: {
    test: { bold: true },
    className: "highlight",
  },
  action: {
    name: "run:command",
    payload: "B",
  },
} as ActionBarItem;
