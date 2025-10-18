import OrderedMap from "orderedmap";
import { addListNodes } from "prosemirror-schema-list";
import { NodeSpec } from "prosemirror-model";
import { columnResizing, tableEditing, tableNodes } from "prosemirror-tables";

export type BaseNodeSpecOptions = {
  table?: boolean;
  list?: boolean;
};

export function getBaseNodeSpec(
  options: BaseNodeSpecOptions = {}
): OrderedMap<NodeSpec> {
  let nodes: OrderedMap<NodeSpec> = OrderedMap.from({
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

  // 支持列表
  if (options.list) {
    nodes = addListNodes(nodes, "paragraph block*", "block");
  }

  // 支持表格
  if (options.table) {
    nodes = nodes.append(
      tableNodes({
        tableGroup: "block",
        cellContent: "paragraph block*",
        cellAttributes: {
          background: {
            default: null,
            getFromDOM: (dom) => dom.style.backgroundColor,
            setDOMAttr: (value, attrs) => {
              if (value)
                attrs.style =
                  (attrs.style || "") + `background-color: ${value};`;
            },
          },
        },
      })
    );
  }

  // 搞定
  return nodes;
}
