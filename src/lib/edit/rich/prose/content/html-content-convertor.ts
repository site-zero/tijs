import _ from "lodash";
import { DOMParser, DOMSerializer, Node } from "prosemirror-model";
import {
  EditorContentConvertor,
  EditorSchema,
  EditorContentProps,
} from "../ti-edit-rich-prose-types";

export function useHTMLContentConvertor(
  _props: EditorContentProps,
  schema: EditorSchema
): EditorContentConvertor {
  const serializer = DOMSerializer.fromSchema(schema);
  const parser = DOMParser.fromSchema(schema);

  function parse(input: string): Node {
    const tpl = document.createElement("template");
    tpl.innerHTML = _.trim(input);
    return parser.parse(tpl.content);
  }

  function render(doc: Node): string {
    let frag = serializer.serializeFragment(doc.content);
    const wrap = document.createElement("div");
    wrap.appendChild(frag);
    return wrap.innerHTML;
  }

  return {
    parse,
    render,
  };
}
