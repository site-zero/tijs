import { Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { computed, reactive, ref } from "vue";
import { Dom } from "../../../..//core/web";
import { EditorCommands } from "./api/use-editor-commands";
import { useEditorDocTree } from "./api/use-editor-doc-tree";
import { useEditorDocSelection } from "./api/use-editor-selection";
import { init_prose_editor } from "./init-prose-editor";
import {
  EditorSchema,
  RichEditorGUIState,
  TiEditRichProseEmitter,
  TiEditRichProseProps,
} from "./ti-edit-rich-prose-types";

export type TiEditRichProseApi = ReturnType<typeof useTiEditRichProseApi>;

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
  //-----------------------------------------------------
  // 界面模块显示开关
  const _gui_state = reactive<RichEditorGUIState>({
    nav: "tree",
    props: true,
    footer: true,
    toolbar: true,
  });
  //-----------------------------------------------------
  // 已经选择的树节点
  const _checked_node_ids = ref<string[]>([]);
  //-----------------------------------------------------
  // 内置子模型
  //-----------------------------------------------------
  // 文档结构树的数据
  const _doc_tree = useEditorDocTree(() => _view);
  // 文档当前选区
  const _doc_selection = useEditorDocSelection(() => _view);
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------

  //-----------------------------------------------------
  // 动态操作编辑器
  //-----------------------------------------------------
  function runCommand(commandName: string) {
    if (_view && _commands) {
      _commands.run(commandName, _view, onTransactionChange);
    }
    const $main = getContainerElement();
    if ($main) {
      const $con = Dom.find(":scope > .ProseMirror", $main);
      if ($con) {
        $con.focus();
      }
    }
  }
  //-----------------------------------------------------
  function onTransactionChange(tr: Transaction) {
    // 更新一下光标位置
    _doc_selection.update(tr);

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
    let reInit = init_prose_editor(props, $con, onTransactionChange);

    // 记录返回到上层闭包
    _view = reInit.view;
    _commands = reInit.commands;
    _schema = reInit.schema;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    TreeData: computed(() => _doc_tree.DocTreeNodes.value),
    TreeCheckedIds: computed(() => _checked_node_ids.value),

    // 内置子模型
    Tree: _doc_tree,

    // 计算属性
    Selection: computed(() => _doc_selection.data.value),

    // 动态操作编辑器
    runCommand,

    // 初始化操作
    initEditor,
    releaseEditor,
  };
}
