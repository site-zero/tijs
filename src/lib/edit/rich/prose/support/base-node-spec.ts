import OrderedMap from "orderedmap";
import { NodeSpec } from "prosemirror-model";

export function getBaseNodeSpec(): OrderedMap<NodeSpec> {
  return OrderedMap.from({
    // 文档根节点
    doc: {
      content: "block+",
    },
    // 段落节点
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0],
    },
    // 文本节点（必备）
    text: {
      inline: true,
      group: "inline",
    },
    // 换行节点
    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM: () => ["br"],
    },
    // 标题节点
    heading: {
      attrs: { level: { default: 1 } },
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } },
      ],
      toDOM: (node: any) => [`h${node.attrs.level}`, 0],
    },
  });
}
