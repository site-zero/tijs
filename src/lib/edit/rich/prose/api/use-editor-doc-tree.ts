import _ from "lodash";
import { Selection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { computed, Ref } from "vue";
import { IconInput } from "../../../../../_type";

export type DocTreeNode = {
  id: string;
  parentId: string | null;
  type: string;
  leaf: boolean;
  from: number;
  to: number;
  icon?: IconInput;
  text?: string;
  tip?: string;
};

export function useEditorDocTree(
  getView: () => EditorView | undefined,
  _doc_tree_data: Ref<DocTreeNode[]>
) {
  //-----------------------------------------------------
  const DocTreeNodeMap = computed(() => {
    const map = new Map<String, DocTreeNode>();
    for (let nd of _doc_tree_data.value) {
      map.set(nd.id, nd);
    }
    return map;
  });
  //-----------------------------------------------------
  function getTreeNode(nodeId: string) {
    return DocTreeNodeMap.value.get(nodeId);
  }
  //-----------------------------------------------------
  function getTreeNodes(nodeIds: string[]) {
    let re: DocTreeNode[] = [];
    for (let nodeId of nodeIds) {
      let nd = DocTreeNodeMap.value.get(nodeId);
      if (nd) {
        re.push(nd);
      }
    }
    return re;
  }
  //-----------------------------------------------------
  /**
   * 更新文档树的根节点。
   * 该函数根据给定的选区和已选中的节点 ID 列表，递归遍历文档节点，
   * 重新构建文档树数据，并更新选中的节点 ID 列表。
   *
   * @param selection - ProseMirror 的选区对象，包含选区的起始和结束位置。
   * @param _checked_node_ids - 一个响应式引用，存储已选中的节点 ID 列表。
   */
  function updateTreeRoot(
    selection: Selection,
    _checked_node_ids: Ref<string[]>
  ) {
    let { from: start, to: end } = selection;
    //console.log("useEditorDocTree", { start, end });
    let doc = getView()?.state.doc;

    // 防空
    if (!doc) return;

    // 准备根节点, 以及解析栈
    let n = 0;
    let root: DocTreeNode = {
      id: `N${n++}`,
      parentId: null,
      type: "document",
      leaf: false,
      from: 0,
      to: -1,
      text: "<Document>",
    };
    let nodes: DocTreeNode[] = [root];
    let idStack = [root.id];
    let checkedIds: string[] = [];
    let cursorCollapsed = start === end;

    // 递归遍历文档节点
    doc.descendants((node, pos) => {
      let rp = doc.resolve(pos);
      let depth = rp.depth; // 顶层节点(<P>)的 depth==0
      let from = pos;
      let to = pos + node.nodeSize;
      let nodeId = `N${n++}`;
      let nodeInRange = false;
      // 创建节点对象
      let nIt: DocTreeNode = {
        id: nodeId,
        parentId: idStack[depth],
        type: node.type.name,
        leaf: node.isAtom || node.isText,
        from,
        to,
        tip: `[${from}-${to}]`,
      };
      // 更新节点文本
      let texts = [] as string[];
      // 文字节点
      // 只要包含选区就选中
      if (node.isText) {
        // 对于坍缩光标，判断是否在节点中
        // 考虑到文字会追加在当前节点的现实，判断的时候
        // 看光标前一个位置会来得比较符合用户直觉
        if (cursorCollapsed) {
          nodeInRange = _.inRange(start - 1, from, to);
        }
        // 否则选区与节点有重合即可
        else {
          nodeInRange = from < end && to > start;
        }
        // 获取文字标注信息
        let marks = node.marks.map((mark) => mark.type.name);
        if (marks.length > 0) {
          texts.push(`[${marks.join(",")}]`);
        }
        texts.push(node.text ?? "");
        nIt.icon = "fas-font";
      }
      // 其他节点
      // 选区必须包含全部，才会被选中
      else {
        // 对于坍缩光标，判断是否在节点中
        if (cursorCollapsed) {
          nodeInRange = _.inRange(start, from, to);
        }
        // 否则节点必须完整包含选区
        else {
          nodeInRange = from <= start && to >= end;
        }

        texts.push(`<${node.type.name}>`);
        nIt.icon = "fas-paragraph";
        if (!node.isAtom && !node.isLeaf) {
          idStack[depth + 1] = nIt.id;
        }
      }

      //console.log("-", nodeId, nIt.type, nodeInRange, { from, to });
      // 更新选择的节点ID
      if (nodeInRange) {
        checkedIds.push(nodeId);
      }
      // 最后确定文本
      nIt.text = texts.join("");
      nodes.push(nIt);
    });

    // 返回数据
    _doc_tree_data.value = nodes;
    _checked_node_ids.value = checkedIds;
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
  return {
    DocTreeNodeMap,
    getTreeNode,
    getTreeNodes,
    updateTreeRoot,
    dumpTree,
  };
}
