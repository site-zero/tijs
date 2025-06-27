import { DroplistProps } from "../../../";
import { ActionBarProps } from "../ti-action-bar-types";

export default {
  name: "toolbar",
  text: "i18n:ti-action-bar-example-toolbar",
  comConf: {
    vars: {
      bold: true,
      italic: true,
      heading: "H2",
    },
    topItemAspectMode: "button",
    topItemMinWidth: null,
    itemSize: "m",
    items: [
      {
        comType: "TiDroplist",
        comConf: {
          placeholder: "Heading",
          value: "=heading",
          options: [
            { value: "H1", text: "Heading 1" },
            { value: "H2", text: "Heading 2" },
            { value: "H3", text: "Heading 3" },
            { value: "H4", text: "Heading 4" },
            { value: "H5", text: "Heading 5" },
            { value: "H6", text: "Heading 6" },
            { value: "P", text: "Paragraph" },
          ],
          width: "150px",
        } as DroplistProps,
        action: "heading",
      },
      {},
      {
        type: "combin",
        items: [
          {
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
          },
          {},
          {
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
          },
          {},
          {
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
          },
        ],
      },
      {},
      {
        icon: "zmdi-link",
        tip: "i18n:link",
        action: "edit:link",
      },
      {},
      {
        icon: "zmdi-quote",
        tip: "i18n:quote",
        action: "wrap:quote",
      },
      {
        icon: "zmdi-undo",
        tip: "i18n:undo",
        action: "undo",
      },
      {
        icon: "zmdi-redo",
        tip: "i18n:redo",
        action: "redo",
      },
    ],
  } as ActionBarProps,
};
