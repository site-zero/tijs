import { exampleSetup } from "prosemirror-example-setup";
import { Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { ref } from "vue";
import {
  TiEditRichProseEmitter,
  TiEditRichProseProps,
} from "./ti-edit-rich-prose-types";
import { inputRules } from "prosemirror-inputrules"; // 输入规则
import { keymap } from "prosemirror-keymap"; // 键盘映射
import { dropCursor } from "prosemirror-dropcursor"; // Drop Cursor
import { gapCursor } from "prosemirror-gapcursor"; // Gap Cursor
import { undo, redo, history } from "prosemirror-history"; // 撤销历史
import { baseKeymap } from "prosemirror-commands"; // 基础键盘绑定
import { toggleMark, setBlockType } from "prosemirror-commands"; // 命令函数

export type TiEditRichProseApi = ReturnType<typeof useTiEditRichProseApi>;

export function useTiEditRichProseApi(
  _props: TiEditRichProseProps,
  getContainerElement: () => HTMLElement | null,
  _emit: TiEditRichProseEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  let _view = ref<EditorView>();
  //-----------------------------------------------------
  function initEditor() {
    let $con = getContainerElement();
    if (!$con) {
      return;
    }

    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
      marks: schema.spec.marks,
    });

    //console.log(exampleSetup({ schema: mySchema, menuBar: false }));
    // ---------------------- 手工配置插件 ---------------------- //

    // 1. 输入规则（Input Rules）：智能引号、Markdown块引用等
    const inputRulesPlugin = inputRules({
      rules: [
        // 示例：智能引号（可根据需求添加更多规则）
        // new InputRule(/^(")([^""]*)(")$/, (state, match, start, end) => { ... }),
        // 示例：Markdown块引用（输入">"触发）
        // new InputRule(/^>(\s+)?$/, (state, match, start, end) => { ... })
        // 注：实际项目中可使用预设规则或扩展社区规则
      ],
    });

    // 2. 键盘映射（Keymaps）：基础绑定 + 自定义绑定
    const customKeymaps = {
      // 基础绑定（如复制、粘贴等）
      ...baseKeymap,
      // 撤销
      "Mod-z": undo,
      "Mod-y": redo,
      // 自定义绑定
      "Mod-i": toggleMark(mySchema.marks.emphasis), // Ctrl/Cmd + I 启用斜体
      "Mod-b": toggleMark(mySchema.marks.strong), // Ctrl/Cmd + B 启用加粗
      // 快速设置标题
      "Ctrl-Shift-1": setBlockType(mySchema.nodes.heading, { level: 1 }), // 标题1
      "Ctrl-Shift-2": setBlockType(mySchema.nodes.heading, { level: 2 }), // 标题2
      "Ctrl-Shift-3": setBlockType(mySchema.nodes.heading, { level: 3 }), // 标题3
      "Ctrl-Shift-4": setBlockType(mySchema.nodes.heading, { level: 4 }), // 标题4
      "Ctrl-Shift-5": setBlockType(mySchema.nodes.heading, { level: 5 }), // 标题5
      "Ctrl-Shift-6": setBlockType(mySchema.nodes.heading, { level: 6 }), // 标题6
    };
    const keymapPlugin = keymap(customKeymaps);

    // 3. Drop Cursor 插件
    const dropCursorPlugin = dropCursor();

    // 4. Gap Cursor 插件
    const gapCursorPlugin = gapCursor();

    // 5. 撤销历史插件
    const historyPlugin = history();

    //
    // 初始化编辑器
    _view.value = new EditorView($con, {
      state: EditorState.create({
        schema: mySchema,
        // plugins: [
        //   history(),
        //   keymap({ "Mod-z": undo, "Mod-y": redo }),
        //   keymap(baseKeymap),
        // ],
        plugins: [
          inputRulesPlugin,
          keymapPlugin,
          dropCursorPlugin,
          gapCursorPlugin,
          historyPlugin,
        ],
        //plugins: exampleSetup({ schema: mySchema, menuBar: false }),
      }),
      // dispatchTransaction(tr) {
      //   console.log(
      //     "Document size went from",
      //     tr.before.content.size,
      //     "to",
      //     tr.doc.content.size
      //   );
      //   // 继续分发事务
      //   //_view.value?.updateState(_view.value.state.apply(tr));
      //   let newState = _view.value!.state.apply(tr);
      //   _view.value!.updateState(newState);
      // },
    });
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    initEditor,
  };
}
