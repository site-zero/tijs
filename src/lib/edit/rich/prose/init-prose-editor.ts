import { baseKeymap } from "prosemirror-commands"; // 基础键盘绑定
import { dropCursor } from "prosemirror-dropcursor"; // Drop Cursor
import { gapCursor } from "prosemirror-gapcursor"; // Gap Cursor
import { history } from "prosemirror-history"; // 撤销历史
import { keymap } from "prosemirror-keymap"; // 键盘映射
import { Schema } from "prosemirror-model";
//import { schema } from "prosemirror-schema-basic";
import { EditorState, Plugin, Transaction } from "prosemirror-state";
import { columnResizing, tableEditing } from "prosemirror-tables";
import { EditorView } from "prosemirror-view";
import { useEditorCommands } from "./api/use-editor-commands";
import { useEditorPlugins } from "./api/use-editor-plugins";
import { EditorToolbarApi } from "./api/use-editor-toolbar";
import { getBaseMarkSpec } from "./support";
import { getBaseNodeSpec } from "./support/base-node-spec";
import {
  RichEditorPluginReadyContext,
  RichEditorPluginSetupContext,
  TiEditRichProseProps,
} from "./ti-edit-rich-prose-types";
import { InputRule, inputRules } from "prosemirror-inputrules";

export function init_prose_editor(
  _props: TiEditRichProseProps,
  $con: HTMLElement,
  toolbar: EditorToolbarApi,
  whenDispatchTransaction: (tr: Transaction) => void
) {
  const _plugins = useEditorPlugins(_props);
  //-----------------------------------------------------
  // 初始化构建设置
  //-----------------------------------------------------
  const setup_context = {
    toolbar,
  } as RichEditorPluginSetupContext;
  setup_context.nodes = getBaseNodeSpec({ table: true, list: true });
  setup_context.marks = getBaseMarkSpec();
  _plugins.setupEditor(setup_context);

  //-----------------------------------------------------
  // 准备构建编辑器
  //-----------------------------------------------------
  // 建立 Schema
  const schema = new Schema({
    nodes: setup_context.nodes,
    marks: setup_context.marks,
  });
  // 可扩展的命令接口
  const commands = useEditorCommands(schema);

  // 最后准备构建上下文
  const ready_context = {
    schema,
    commands,
    inputRules: [] as InputRule[],
  } as RichEditorPluginReadyContext;

  // 2. 键盘映射（Keymaps）：基础绑定 + 自定义绑定
  ready_context.keymaps = {
    // 基础绑定（如复制、粘贴等）
    ...baseKeymap,
    // 撤销
    "Mod-z": commands.get("undo"),
    "Mod-y": commands.get("redo"),
    // 自定义绑定
    "Mod-i": commands.get("I"),
    "Mod-b": commands.get("B"),
    "Mod-u": commands.get("U"),
    // Shift+Enter 生成段内回车
    "Mod-Enter": commands.get("br"),
    // 缩进
    "Tab": commands.get("indent"),
    "Shift-Tab": commands.get("shift_indent"),
    // 快速设置标题
    "Ctrl-Shift-1": commands.get("h1"),
    "Ctrl-Shift-2": commands.get("h2"),
    "Ctrl-Shift-3": commands.get("h3"),
    "Ctrl-Shift-4": commands.get("h4"),
    "Ctrl-Shift-5": commands.get("h5"),
    "Ctrl-Shift-6": commands.get("h6"),
    "Ctrl-Shift-`": commands.get("p"),
  };

  // 编辑器的插件列表
  const keymapPlugin = keymap(ready_context.keymaps);
  const dropCursorPlugin = dropCursor();
  const gapCursorPlugin = gapCursor();
  const historyPlugin = history();
  ready_context.plugins = [
    keymapPlugin,
    dropCursorPlugin,
    gapCursorPlugin,
    historyPlugin,
    columnResizing(), // 添加列宽调整插件
    tableEditing(), // 表格编辑插件放在后面
    //helloProsePlugin(),
  ] as Plugin<any>[];

  // 最后处理一下配置
  _plugins.readyEditor(ready_context);

  //-----------------------------------------------------
  // 都准备好了，开始构建编辑器
  //-----------------------------------------------------
  // 输入规则
  const editorInputRules = inputRules({ rules: ready_context.inputRules });
  // 初始化编辑器
  const view = new EditorView($con, {
    state: EditorState.create({
      schema: ready_context.schema,
      plugins: [...ready_context.plugins, editorInputRules],
    }),
    // 在这里监听编辑器所有的变化
    dispatchTransaction(tr) {
      // 这个函数的 this 实际上就是 _view
      // 之前，我将 _view 作为 Ref<EditView> 为了获得最大响应性
      // 但是我发现，调用 _view.value.updateState 的时候
      // 控制台会报错:
      //  > Applying a mismatched transaction
      // 因为 _view.value 本质上是一个 Proxy 对象，
      // 它并不是 EditorView 对象本身，而去掉 _view 响应性的包裹的确没有问题了
      // 看来这种异常复杂的对象还是不能随意的用响应式来包裹
      //let view = this as unknown as EditorView;
      const newState = view.state.apply(tr);
      view.updateState(newState);

      // 检查选择范围是否变化
      whenDispatchTransaction(tr);
    },
  });

  // 返回输出
  return {
    view,
    schema: ready_context.schema,
    commands: ready_context.commands,
  };
}
