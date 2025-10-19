import { Transaction } from "prosemirror-state";
import { computed, ref } from "vue";
import { DocTreeNode, EditorDocTreeApi } from "./use-editor-doc-tree";

/**
 * 记录选区信息，根据 Transaction.selection 统计出来
 */
export type EditorDocSelection = {
  // 光标状态
  from: number;
  to: number;
  collapsed: boolean;

  // 锚点所在块节点名称
  anchor: DocTreeNode | null;
  head: DocTreeNode | null;

  // 节点路径轴
  path: DocTreeNode[];

  // 选取所在的顶级节点
  top: DocTreeNode | null;

  // 选区包含的 marks
  marks: string[];
};

export function useEditorDocSelection(_doc_tree: EditorDocTreeApi) {
  const _editor_selection = ref<EditorDocSelection>({
    from: 0,
    to: 0,
    collapsed: false,
    marks: [],
    anchor: null,
    head: null,
    path: [],
    top: null,
  });
  //-----------------------------------------------------
  function update(tr: Transaction) {
    let sel = tr.selection;
    let { from, to } = sel;

    let _sel = _editor_selection.value;

    // 更新光标选区
    _sel.from = sel.from;
    _sel.to = sel.to;
    _sel.collapsed = from == to;

    // 更新锚点所在节点
    _sel.anchor = _doc_tree.findNodeByPos(sel.anchor);
    if (_sel.collapsed) {
      _sel.head = _sel.anchor;
    } else {
      _sel.head = _doc_tree.findNodeByPos(sel.head);
    }

    // 更新所有父节点
    let path: DocTreeNode[];
    if (_sel.collapsed) {
      path = _doc_tree.getNodeAncestors(_sel.anchor);
    }
    // 寻找共同祖先
    else {
      let ph_anchor = _doc_tree.getNodeAncestors(_sel.anchor);
      let ph_head = _doc_tree.getNodeAncestors(_sel.head);
      // console.log(
      //   "anch",
      //   ph_anchor.length,
      //   ph_anchor.map((nd) => [nd.name, nd.id].join(":")).join(" > ")
      // );
      // console.log(
      //   "head",
      //   ph_head.length,
      //   ph_head.map((nd) => [nd.name, nd.id].join(":")).join(" > ")
      // );
      path = [];
      let N = Math.min(ph_anchor.length, ph_head.length);
      for (let i = 0; i < N; i++) {
        let aa = ph_anchor[i];
        let ah = ph_head[i];
        if (aa.id != ah.id) {
          break;
        }
        path.push(aa);
      }
      // console.log(
      //   "path",
      //   path.length,
      //   path.map((nd) => [nd.name, nd.id].join(":")).join(" > ")
      // );
    }
    _sel.path = path;

    // 更新选区的标记
    _sel.marks =
      sel.$from.marksAcross(sel.$to)?.map((mark) => {
        return mark.type.name;
      }) ?? [];
  }
  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    data: computed(() => _editor_selection.value),
    update,
  };
}
