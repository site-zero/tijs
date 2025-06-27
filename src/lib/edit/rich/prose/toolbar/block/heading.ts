import { ActionBarItem, DroplistProps } from "../../../../../../";

export default {
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
} as ActionBarItem;
