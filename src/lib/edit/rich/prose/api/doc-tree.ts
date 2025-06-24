import { EditorView } from "prosemirror-view";
import { Ref } from "vue";
import { Vars } from "../../../../../_type";

export function useEditorDocTree(
  getView: () => EditorView | undefined,
  _doc_tree_data: Ref<Vars[]>
) {
  //-----------------------------------------------------
  function updateTreeRoot(from: number, to: number) {
    let doc = getView()?.state.doc;

    // 防空
    if (!doc) return;

    // 准备根节点, 以及解析栈
    let n = 0;
    let root = { id: `N${n++}`, text: "Document" };
    let nodes: Vars[] = [root];
    let idStack = [root.id];
    doc.descendants((node, pos) => {
      let rp = doc.resolve(pos);
      let depth = rp.depth; // 顶层节点(<P>)的 depth==0
      let nodeItem: Vars = {
        id: `N${n++}`,
        parentId: idStack[depth],
        type: node.type.name,
        leaf: node.isAtom || node.isText,
      };
      // 文字节点
      if (node.isText) {
        let texts = [] as string[];
        let marks = node.marks.map((mark) => mark.type.name);
        if (marks.length > 0) {
          texts.push(`[${marks.join(",")}]`);
        }
        texts.push(node.text ?? "");
        nodeItem.text = texts.join("");
        nodeItem.icon = "fas-font";
      }
      // 其他节点
      else {
        nodeItem.text = `<${node.type.name}>`;
        nodeItem.icon = "fas-paragraph";
        if (!node.isAtom && !node.isLeaf) {
          idStack[depth + 1] = nodeItem.id;
        }
      }
      if (node) {
        nodes.push(nodeItem);
      }
    });

    // 返回数据
    _doc_tree_data.value = nodes;
  }
  //-----------------------------------------------------
  function dumpTree(): string {
    let doc = getView()?.state.doc;

    // 防空
    if (!doc) {
      return "View without INIT";
    }

    // 准备结果集
    let result = "";

    doc.descendants((node, pos) => {
      const rp = doc.resolve(pos);
      const depth = rp.depth;
      const indent = "│ ".repeat(depth);
      const nodeType = node.type.name;
      const size = node.nodeSize;
      const text = node.isText ? `: "${node.text}"` : "";

      result += `${indent}├─ ${nodeType} [${pos}-${
        pos + size
      }:depth=${depth}:atom=${node.isAtom}:leaf=${node.isLeaf}]${text}\n`;
    });

    return result;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return { updateTreeRoot, dumpTree };
}
