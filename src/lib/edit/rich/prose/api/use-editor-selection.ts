import { Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { computed, ref } from "vue";

export type EditorCursor = {
  from: number;
  to: number;
  collapse: boolean;
};

/**
 * 记录选区信息，根据 Transaction.selection 统计出来
 */
export type EditorDocSelection = {
  // 光标状态
  cursor: EditorCursor;

  // 锚点所在块节点名称
  anchorNodeName?: string | null | undefined;
  headNodeName?: string | null | undefined;

  // 选区包含的 marks
  marks: string[];

  // 锚点所在大纲级别
  // - 0: 正文
  // - 1-6: 大纲级别 H1 ~ H6
  anchorHeadingLevel: 0;
  headHeadingLevel: 0;
};

export function useEditorDocSelection(_getView: () => EditorView | undefined) {
  const _editor_selection = ref<EditorDocSelection>({
    cursor: { from: 0, to: 0, collapse: false },
    marks: [],
    anchorHeadingLevel: 0,
    headHeadingLevel: 0,
  });
  //-----------------------------------------------------
  function update(tr: Transaction) {
    let tsel = tr.selection;
    let { from, to } = tsel;

    let _sel = _editor_selection.value;

    // 更新光标选区
    _sel.cursor = {
      from,
      to,
      collapse: from == to,
    };

    let $an = tsel.$anchor.node();
    let $hd = tsel.$head.node();

    // 更新锚点所在节点
    _sel.anchorNodeName = $an.type.name;
    _sel.headNodeName = $hd.type.name;

    // 更新选区的标记
    _sel.marks =
      tsel.$from.marksAcross(tsel.$to)?.map((mark) => {
        return mark.type.name;
      }) ?? [];

    // 更新锚点所在大纲级别
    _sel.anchorHeadingLevel = $an.attrs.level ?? 0;
    _sel.headHeadingLevel = $hd.attrs.level ?? 0;
  }
  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    cursor: computed(() => _editor_selection.value.cursor),
    data: computed(() => _editor_selection.value),
    update,
  };
}
