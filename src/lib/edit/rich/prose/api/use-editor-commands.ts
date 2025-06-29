import { redo, undo } from "prosemirror-history"; // 撤销历史
import { Command, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useBlockTypeCommands } from "../command/block_type.cmd";
import { insert_br } from "../command/insert.br.cmd";
import { insert_hr } from "../command/insert.hr.cmd";

import { useBlockWrappingCommands } from "../command/block_wrap.cmd";
import { useToggleMarkCommands } from "../command/toggle_mark.cmd";
import { EditorSchema } from "../ti-edit-rich-prose-types";

export type EditorCommands = ReturnType<typeof useEditorCommands>;

/**
 * 创建并返回一个编辑器命令对象，该对象包含各种编辑器操作命令。
 *
 * @param schema - 编辑器的模式对象，用于定义编辑器支持的节点和标记。
 * @returns 包含编辑器命令的对象，包含命令映射、获取命令和执行命令的方法。
 */
export function useEditorCommands(schema: EditorSchema) {
  // Heading & BlockType
  const block_types = useBlockTypeCommands(schema);

  // wrap block
  const block_wrapping = useBlockWrappingCommands(schema);

  // Marks
  const marks = useToggleMarkCommands(schema);

  // Build command map
  const _commands: Record<string, Command> = {
    br: insert_br,
    hr: insert_hr,
    undo: undo,
    redo: redo,
    ...block_types,
    ...block_wrapping,
    ...marks,
  };

  /**
   * 根据键名获取对应的编辑器命令。
   *
   * @param key - 要获取的命令的键名。
   * @returns 对应的编辑器命令，如果未找到则返回 undefined。
   */
  function get(key: string) {
    return _commands[key];
  }

  /**
   * 执行指定的编辑器命令。
   *
   * @param key - 要执行的命令的键名。
   * @param view - ProseMirror 编辑器视图对象。
   * @param callback - 命令执行成功后调用的回调函数，接收一个 Transaction 对象作为参数。
   */
  function run(
    key: string,
    view: EditorView,
    callback?: (tr: Transaction) => void
  ) {
    let cmd = get(key);
    if (!cmd) {
      console.warn(`Fail to found command [${key}] in EditorCommands`);
      return;
    }
    cmd(
      view.state,
      (tr) => {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        if (callback) {
          callback(tr);
        }
      },
      view
    );
  }

  return {
    _commands,
    get,
    run,
  };
}
