import JSON5 from "json5";
import _ from "lodash";
import { Node } from "prosemirror-model";
import {
  EditorContentConvertor,
  EditorContentProps,
  EditorSchema,
} from "../ti-edit-rich-prose-types";

export function useJsonContentConvertor(
  props: EditorContentProps,
  schema: EditorSchema
): EditorContentConvertor {
  function parse(input: string): Node {
    const str = _.trim(input);
    // 默认搞个空文档
    let data = {
      type: "doc",
      content: [{ type: "paragraph" }],
    };
    // 有内容及时解析一下
    if (str) {
      data = JSON5.parse(input);
    }
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
