import { redo, undo } from "prosemirror-history"; // 撤销历史
import { Command, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useBlockTypeCommands } from "../command/block_type.cmd";
import { br_command } from "../command/br.cmd";
import { useToggleMarkCommands } from "../command/toggle_mark.cmd";
import { EditorSchema } from "../ti-edit-rich-prose-types";

export type EditorCommands = ReturnType<typeof useEditorCommands>;

export function useEditorCommands(schema: EditorSchema) {
  // Heading & BlockType
  const blocks = useBlockTypeCommands(schema);

  // Marks
  const marks = useToggleMarkCommands(schema);

  // Build command map
  const _commands: Record<string, Command> = {
    br: br_command,
    undo: undo,
    redo: redo,
    ...blocks,
    ...marks,
  };

  // 获取一个 command
  function get(key: string) {
    return _commands[key];
  }

  // 执行一个 command
  function run(
    key: string,
    view: EditorView,
    callback?: (tr: Transaction) => void
  ) {
    let cmd = get(key);
    if (!cmd) {
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
