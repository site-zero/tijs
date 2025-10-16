import { ActionBarItem, DroplistProps } from "../../../../../";

export const heading = {
  comType: "TiDroplist",
  comConf: {
    placeholder: "Heading",
    value: "=heading",
    options: [
      { value: "h1", text: "Heading 1" },
      { value: "h2", text: "Heading 2" },
      { value: "h3", text: "Heading 3" },
      { value: "h4", text: "Heading 4" },
      { value: "h5", text: "Heading 5" },
      { value: "h6", text: "Heading 6" },
      { value: "p", text: "Paragraph" },
    ],
    width: "150px",
  } as DroplistProps,
  action: "run:command",
} as ActionBarItem;

export const blockquote = {
  icon: "zmdi-quote",
  tip: "i18n:quote",
  action: {
    name: "run:command",
    payload: "blockquote",
  },
} as ActionBarItem;

export const code_block = {
  icon: "zmdi-code-setting",
  tip: "i18n:code-block",
  action: {
    name: "run:command",
    payload: "code_block",
  },
} as ActionBarItem;

export const ol = {
  icon: "fas-list-ol",
  tip: "i18n:order-list",
  action: {
    name: "run:command",
    payload: "ol",
  },
} as ActionBarItem;

export const ul = {
  icon: "fas-list-ul",
  tip: "i18n:unorder-list",
  action: {
    name: "run:command",
    payload: "ul",
  },
} as ActionBarItem;

export const hr = {
  icon: "fas-minus",
  tip: "i18n:horizontal_rule",
  action: {
    name: "run:command",
    payload: "hr",
  },
} as ActionBarItem;
