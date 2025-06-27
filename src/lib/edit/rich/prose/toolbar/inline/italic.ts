import { ActionBarItem } from "../../../../../../";

export default {
  icon: "zmdi-format-italic",
  tip: "i18n:italic",
  altDisplay: {
    test: { italic: true },
    className: "highlight",
  },
  action: {
    name: "toggleMark",
    payload: {
      mark: "italic",
    },
  },
} as ActionBarItem;
