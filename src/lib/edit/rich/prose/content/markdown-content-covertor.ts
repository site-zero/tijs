import JSON5 from "json5";
import { Node } from "prosemirror-model";
import {
  EditorContentConvertor,
  EditorSchema,
  EditorContentProps,
} from "../ti-edit-rich-prose-types";
import _ from "lodash";

export function useMarkdownContentConvertor(
  _props: EditorContentProps,
  _schema: EditorSchema
): EditorContentConvertor {
  function parse(_input: string): Node {
    throw "Markdown 格式不支持解析";
  }

  function render(_doc: Node): string {
    throw "Markdown 格式不支持渲染";
  }

  return {
    parse,
    render,
  };
}
