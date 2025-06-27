import { NodeType } from "prosemirror-model";
import { IconInput } from "../../../../../_type";

const _NODE_ICONS: Record<string, IconInput> = {
  paragraph: "fas-paragraph",
  //text: "fas-font",
  text: "fas-align-justify",
  hard_break: "zmdi-long-arrow-return",
  heading: "fas-heading",
  doc: "fas-file",
  blockquote: "fas-quote-left",
  horizontal_rule: "fas-ruler-horizontal",
  code_block: "fas-code",
  image: "fas-image",
  ordered_list: "list-ol",
  bullet_list: "list-ul",
  list_item: "fas-minus",
};

export function getNodeIcon(nodeType: NodeType) {
  return _NODE_ICONS[nodeType.name] || "fas-parachute-box";
}
