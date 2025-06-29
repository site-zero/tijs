import { ActionBarItem } from "../../../../../";

export const B = {
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

export const I = {
  icon: "zmdi-format-italic",
  tip: "i18n:italic",
  altDisplay: {
    test: { italic: true },
    className: "highlight",
  },
  action: {
    name: "run:command",
    payload: "I",
  },
} as ActionBarItem;

export const U = {
  icon: "zmdi-format-underlined",
  tip: "i18n:underlined",
  altDisplay: {
    test: { underlined: true },
    className: "highlight",
  },
  action: {
    name: "run:command",
    payload: "U",
  },
} as ActionBarItem;

export const code = {
  icon: "zmdi-code",
  tip: "i18n:code",
  action: {
    name: "run:command",
    payload: "code",
  },
} as ActionBarItem;

export const link = {
  icon: "zmdi-link",
  tip: "i18n:link",
  action: "edit:link",
} as ActionBarItem;
