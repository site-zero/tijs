import { ActionBarItem } from "../../../../../../";

export default {
  icon: "zmdi-format-underlined",
  tip: "i18n:underlined",
  altDisplay: {
    test: { underlined: true },
    className: "highlight",
  },
  action: {
    name: "toggleMark",
    payload: {
      mark: "underlined",
    },
  },
} as ActionBarItem;
