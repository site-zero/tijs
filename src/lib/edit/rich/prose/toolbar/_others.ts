import { ActionBarItem } from "../../../../../";

export const undo = {
  icon: "zmdi-undo",
  tip: "i18n:undo",
  action: {
    name: "run:command",
    payload: "undo",
  },
} as ActionBarItem;

export const redo = {
  icon: "zmdi-redo",
  tip: "i18n:redo",
  action: {
    name: "run:command",
    payload: "redo",
  },
} as ActionBarItem;
