import { ActionBarItem } from "../../../../../../";

export default {
  icon: "zmdi-redo",
  tip: "i18n:redo",
  action: {
    name: "run:command",
    payload: "redo",
  },
} as ActionBarItem;
