import { ActionBarItem } from "../../../../../../";

export default {
  icon: "zmdi-undo",
  tip: "i18n:undo",
  action: {
    name: "run:command",
    payload: "undo",
  },
} as ActionBarItem;
