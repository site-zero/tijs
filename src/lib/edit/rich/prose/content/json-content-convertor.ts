import JSON5 from "json5";
import { Node } from "prosemirror-model";
import {
  EditorContentConvertor,
  EditorContentProps,
  EditorSchema,
  EditorToolbarProps,
} from "../ti-edit-rich-prose-types";
import _ from "lodash";

export function useJsonContentConvertor(
  props: EditorContentProps,
  schema: EditorSchema
): EditorContentConvertor {
  function parse(input: string): Node {
    const data = JSON5.parse(input);
    return Node.fromJSON(schema, data);
  }

  function render(doc: Node): string {
    const data = doc.toJSON();
    // 指定了缩进级别
    if (_.isNumber(props.jsonFormator)) {
      return JSON.stringify(data, null, props.jsonFormator);
    }
    // 自定义
    if (_.isFunction(props.jsonFormator)) {
      return props.jsonFormator(data);
    }
    // 默认直接转换为 JSON 字符串
    return JSON.stringify(data);
  }

  return {
    parse,
    render,
  };
}
