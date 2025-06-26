import { NodeType } from "prosemirror-model";
import { IconInput } from "../../../../../_type";

const _NODE_ICONS: Record<string, IconInput> = {
  paragraph: "fas-paragraph",
  //text: "fas-font",
  text: "fas-align-justify",
  hard_break: "zmdi-long-arrow-return",
  heading: "fas-heading",
};

export function getNodeIcon(nodeType: NodeType) {
  return _NODE_ICONS[nodeType.name] || "fas-parachute-box";
}
