import _ from "lodash";
import { Selection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { computed, Ref } from "vue";
import { IconInput } from "../../../../../_type";
import { getNodeIcon } from "./doc-tree-node-icons";

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
  /**
   * 根据文档光标位置，搜索文档节点列表 `_doc_tree_data.value`
   * 根据节点的 from 和 to 属性判断光标是否落到这个节点上
   * 查找的方式采用二分法查找
   *
   * @param pos 文档光标的绝对位置
   */
  function findTreeNodeAt(pos: number): DocTreeNode | undefined {
    // 所有的中间节点
    let nodes = _doc_tree_data.value.filter((nd) => !nd.leaf);

    let left = 0;
    let right = nodes.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const node = nodes[mid];

      if (pos >= node.from && pos <= node.to) {
        return _.cloneDeep(node);
      } else if (pos < node.from) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return undefined;
  }

  /**
   * 根据一个选区，获取能涵盖这个选区最近的节点
   *
   *
   * @param from 选区开始位置
   * @param to  选区结束位置
   */
  // function findTreeNodeByRange(from:number,to:number):DocTreeNode|undefined {

  // }
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
    let cursor_is_collapsed = selection.from === selection.to;
    const _in_selection = (pos: number) => {
      return pos >= selection.from && pos < selection.to;
    };
    //console.log("useEditorDocTree", { start, end });
    const doc = getView()?.state.doc;

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

    // 递归遍历文档节点
    doc.descendants((node, pos) => {
      const rp = doc.resolve(pos);
      const depth = rp.depth; // 顶层节点(<P>)的 depth==0
      const from = pos;
      const to = pos + node.nodeSize;
      const _in_node = (p: number) => {
        return p >= from && p < to;
      };

      const nodeId = `N${n++}`;

      // 创建节点对象
      const nIt: DocTreeNode = {
        id: nodeId,
        parentId: idStack[depth],
        type: node.type.name,
        leaf: node.isAtom || node.isText,
        from,
        to,
        tip: `[${from}-${to}]`,
        icon: getNodeIcon(node.type),
      };

      let nodeInRange = false;
      // 坍缩的光标，判断是否在节点中
      if (cursor_is_collapsed) {
        let pos = selection.from;
        if (node.isText) {
          pos -= 1;
        }
        nodeInRange = _.inRange(pos, from, to);
      }
      // 选区，那么判断节点两端是否在选区中
      else {
        nodeInRange =
          _in_selection(from) ||
          _in_selection(to - 1) ||
          _in_node(selection.from) ||
          _in_node(selection.to - 1);
      }

      // 更新节点文本
      let texts = [] as string[];
      // 文字节点
      // 只要包含选区就选中
      if (node.isText && node.text) {
        // 获取文字标注信息
        let marks = node.marks.map((mark) => mark.type.name);
        if (marks.length > 0) {
          texts.push(`[${marks.join(",")}]`);
        }
        if (node.text.length < 100) {
          texts.push(node.text ?? "");
        } else {
          texts.push(node.text.substring(0, 100) ?? "");
        }
      }
      // 其他节点
      // 选区必须包含全部，才会被选中
      else {
        texts.push(`<${node.type.name}>`);
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
    findTreeNodeAt,
    updateTreeRoot,
    dumpTree,
  };
}
