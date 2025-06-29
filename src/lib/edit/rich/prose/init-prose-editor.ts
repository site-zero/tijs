import { baseKeymap } from "prosemirror-commands"; // 基础键盘绑定
import { dropCursor } from "prosemirror-dropcursor"; // Drop Cursor
import { gapCursor } from "prosemirror-gapcursor"; // Gap Cursor
import { history, redo, undo } from "prosemirror-history"; // 撤销历史
import { inputRules } from "prosemirror-inputrules"; // 输入规则
import { keymap } from "prosemirror-keymap"; // 键盘映射
import { Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState, Transaction } from "prosemirror-state";
import { tableNodes } from "prosemirror-tables";
import { EditorView } from "prosemirror-view";
import { useEditorCommands } from "./api/use-editor-commands";
import { EditorSchema, TiEditRichProseProps } from "./ti-edit-rich-prose-types";

export function init_prose_editor(
  _props: TiEditRichProseProps,
  $con: HTMLElement,
  whenDispatchTransaction: (tr: Transaction) => void
) {
  let marks = schema.spec.marks;
  marks = marks.append({
    underline: {
      parseDOM: [{ tag: "u" }],
      toDOM: () => ["u", 0],
    },
  });

  // 建立支持的节点
  let nodes = addListNodes(schema.spec.nodes, "paragraph block*", "block");

  // 支持表格
  nodes = nodes.append(
    tableNodes({
      tableGroup: "block",
      cellContent: "paragraph block*",
      cellAttributes: {
        background: {
          default: null,
          getFromDOM: (dom) => dom.style.backgroundColor,
          setDOMAttr: (value, attrs) => {
            if (value)
              attrs.style = (attrs.style || "") + `background-color: ${value};`;
          },
        },
      },
    })
  );

  const mySchema: EditorSchema = new Schema({
    nodes,
    marks,
  });

  let i = 0;
  mySchema.spec.nodes.forEach((key, val) => {
    console.log("node", i++, key, val);
  });

  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  i = 0;
  mySchema.spec.marks.forEach((key, val) => {
    console.log("mark", i++, key, val);
  });

  const myCommands = useEditorCommands(mySchema);

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
    "Mod-i": myCommands.get("I"),
    "Mod-b": myCommands.get("B"),
    // Shift+Enter 生成段内回车
    "Shift-Enter": myCommands.get("br"),
    // 快速设置标题
    "Ctrl-Shift-1": myCommands.get("h1"),
    "Ctrl-Shift-2": myCommands.get("h2"),
    "Ctrl-Shift-3": myCommands.get("h3"),
    "Ctrl-Shift-4": myCommands.get("h4"),
    "Ctrl-Shift-5": myCommands.get("h5"),
    "Ctrl-Shift-6": myCommands.get("h6"),
    "Ctrl-Shift-0": myCommands.get("p"),
  };

  const keymapPlugin = keymap(customKeymaps);

  // 3. Drop Cursor 插件
  const dropCursorPlugin = dropCursor();

  // 4. Gap Cursor 插件
  const gapCursorPlugin = gapCursor();

  // 5. 撤销历史插件
  const historyPlugin = history();

  // 初始化编辑器
  const view = new EditorView($con, {
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
        // menuBar({
        //   content: buildMenuItems(schema).fullMenu,
        // }),
      ],
      //plugins: exampleSetup({ schema: mySchema, menuBar: false }),
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
      let view = this as unknown as EditorView;
      const newState = view.state.apply(tr);
      view.updateState(newState);

      // 检查选择范围是否变化
      whenDispatchTransaction(tr);
    },
  });

  // 返回输出
  return {
    view,
    commands: myCommands,
    schema: mySchema,
  };
}
