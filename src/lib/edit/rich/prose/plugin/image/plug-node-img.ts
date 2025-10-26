import { NodeSpec } from "prosemirror-model";
import { RichEditorPluginSetupContext } from "../../ti-edit-rich-prose-types";

// 设置图片节点 - 返回更新后的 nodes 集合
export function setupImageNode(context: RichEditorPluginSetupContext) {
  // 定义 image 节点配置
  const imageNodeSpec: NodeSpec = {
    inline: true,
    attrs: {
      src: { default: null },
      title: { default: null },
      // 样式统一放在 style 字符串里
      style: { default: null },
    },
    group: "inline",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom: HTMLElement) {
          return {
            src: dom.getAttribute("src"),
            title: dom.getAttribute("title"),
            style: dom.getAttribute("style"),
          };
        },
      },
    ],
    toDOM(node) {
      const { src, title, style } = node.attrs;
      return [
        "span",
        {
          class: "ti-img",
          style: `
          display:inline-block;
          position:relative;
          vertical-align:bottom;
          line-height:0;
          `,
        },
        ["img", { src, title, style }],
      ];
    },
  };

  // OrderedMap 是不可变的，append 返回包含新节点的副本
  context.nodes = context.nodes.append({ image: imageNodeSpec });
}
