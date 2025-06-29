import { Command, TextSelection } from "prosemirror-state";
import { findWrapping } from "prosemirror-transform";
import { EditorSchema } from "../ti-edit-rich-prose-types";

export function useBlockWrappingCommands(schema: EditorSchema) {
  /**
   * 使用 blockquote 包裹选中的块内容
   * @param state - 当前编辑器状态
   * @param dispatch - 用于派发事务的函数，如果为 undefined 则表示仅检查是否可执行
   * @returns 如果可以执行包裹操作则返回 true，否则返回 false
   */
  const wrapBlockquote: Command = (state, dispatch) => {
    // 获取 blockquote 节点类型
    const blockquote = schema.nodes.blockquote;

    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);
    const wrapping = range && findWrapping(range, blockquote);

    if (!wrapping) return false;

    if (dispatch) {
      dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
    }

    return true;
  };

  /**
   * 使用代码块包裹选中的块内容
   * @param state - 当前编辑器状态
   * @param dispatch - 用于派发事务的函数，如果为 undefined 则表示仅检查是否可执行
   * @returns 如果可以执行包裹操作则返回 true，否则返回 false
   */
  const insertCodeBlock: Command = (state, dispatch) => {
    const { selection } = state;
    const type = schema.nodes.code_block;

    if (!type) return false;

    if (dispatch) {
      const { from, to } = selection;
      const tr = state.tr;

      // 如果选区有内容，替换为代码块
      if (from !== to) {
        tr.delete(from, to);
      }

      // 插入代码块节点，并包含选中的文本（如果有）
      const codeText = from !== to ? selection.content().content : null;
      tr.replaceSelectionWith(type.create(null, codeText));

      // 将光标移动到代码块内
      if (selection.empty) {
        const pos = tr.mapping.map(from);
        tr.setSelection(TextSelection.near(tr.doc.resolve(pos)));
      }

      dispatch(tr.scrollIntoView());
    }

    return true;
  };

  //------------------------------------------------------
  // 返回命令集
  //------------------------------------------------------
  return {
    blockquote: wrapBlockquote,
    code_block: insertCodeBlock,
  };
}
