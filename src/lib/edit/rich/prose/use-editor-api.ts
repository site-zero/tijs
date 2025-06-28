import { EditorView } from "prosemirror-view";
import { computed, reactive, ref } from "vue";
import { EditorCommands } from "./api/use-editor-commands";
import { DocTreeNode, useEditorDocTree } from "./api/use-editor-doc-tree";
import { init_prose_editor } from "./init-prose-editor";
import {
  EditorSchema,
  RichEditorGUIState,
  TiEditRichProseEmitter,
  TiEditRichProseProps,
} from "./ti-edit-rich-prose-types";
import { Dom } from "../../../..//core/web";
import { Transaction } from "prosemirror-state";
import { update } from "lodash";

export type TiEditRichProseApi = ReturnType<typeof useTiEditRichProseApi>;

export type EditorCursor = {
  from: number;
  to: number;
};

export function useTiEditRichProseApi(
  props: TiEditRichProseProps,
  getContainerElement: () => HTMLElement | null,
  _emit: TiEditRichProseEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  let _view: EditorView | undefined = undefined;
  let _commands: EditorCommands | undefined = undefined;
  let _schema: EditorSchema | undefined = undefined;
  // 文档结构树的数据
  let _doc_tree_data = ref<DocTreeNode[]>([]);
  // 界面模块显示开关
  let _gui_state = reactive<RichEditorGUIState>({
    nav: "tree",
    props: true,
    footer: true,
    toolbar: true,
  });
  //-----------------------------------------------------
  // 已经选择的树节点
  let _checked_node_ids = ref<string[]>([]);
  //-----------------------------------------------------
  // 光标状态
  let _cursor = ref<EditorCursor>({ from: 0, to: 0 });
  //-----------------------------------------------------
  // 内置子模型
  //-----------------------------------------------------
  let _doc_tree = useEditorDocTree(() => _view, _doc_tree_data);
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const CursorInfo = computed(() => {
    let { from, to } = _cursor.value;
    if (from === to) {
      return `${from}`;
    }
    return [from, to].join("-");
  });
  //-----------------------------------------------------
  // 动态操作编辑器
  //-----------------------------------------------------
  function runCommand(commandName: string) {
    if (_view && _commands) {
      _commands.run(commandName, _view, (tr) => {
        updateSelection(tr);
      });
    }
    const $main = getContainerElement();
    if ($main) {
      const $con = Dom.find(":scope > .ProseMirror", $main);
      if ($con) {
        $con.focus();
      }
    }
  }
  // function select(_from: number, _to: number) {
  //   // 防空
  //   if (!_view) return;

  //   // 1. 获取状态接口
  //   const state = _view.state;

  //   // 2. 创建 TextSelection（文本选区）
  //   //const selection = TextSelection.create(state.doc, from, to);
  //   const selection = TextSelection.create(state.doc, 2, 3);

  //   // 3. 创建事务并设置选区
  //   const tr: Transaction = state.tr.setSelection(selection);

  //   // 4. 提交事务，更新编辑器状态
  //   _view.dispatch(tr);
  // }
  //-----------------------------------------------------
  function updateSelection(tr: Transaction) {
    // 更新一下光标位置
    _cursor.value.from = tr.selection.from;
    _cursor.value.to = tr.selection.to;

    // 检查选择范围是否变化
    _doc_tree.updateTreeRoot(tr.selection, _checked_node_ids);
  }
  //-----------------------------------------------------
  // 初始化操作
  //-----------------------------------------------------
  function releaseEditor() {
    if (_view) {
      _view.destroy();
      _view = undefined;
    }
  }
  //-----------------------------------------------------
  function initEditor() {
    let $con = getContainerElement();
    if (!$con) {
      return;
    }

    // 确保释放所有已经分配的编辑器资源
    releaseEditor();

    // 通过一个回调函数，结合 _doc_tree 子模型
    // TODO 思考一下，是不是把 _doc_tree 传递过去改动更小呢？
    let reInit = init_prose_editor(props, $con, (tr) => {
      updateSelection(tr);
    });

    // 记录返回到上层闭包
    _view = reInit.view;
    _commands = reInit.commands;
    _schema = reInit.schema;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    TreeData: computed(() => _doc_tree_data.value),
    TreeCheckedIds: computed(() => _checked_node_ids.value),

    // 内置子模型
    Tree: _doc_tree,

    // 计算属性
    CursorInfo,

    // 动态操作编辑器
    runCommand,

    // 初始化操作
    initEditor,
    releaseEditor,
  };
}
