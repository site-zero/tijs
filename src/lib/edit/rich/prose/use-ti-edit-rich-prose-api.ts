import { baseKeymap, setBlockType, toggleMark } from "prosemirror-commands"; // 基础键盘绑定
import { dropCursor } from "prosemirror-dropcursor"; // Drop Cursor
import { gapCursor } from "prosemirror-gapcursor"; // Gap Cursor
import { history, redo, undo } from "prosemirror-history"; // 撤销历史
import { inputRules } from "prosemirror-inputrules"; // 输入规则
import { keymap } from "prosemirror-keymap"; // 键盘映射
import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { computed, reactive, ref } from "vue";
import { DocTreeNode, useEditorDocTree } from "./api/use-editor-doc-tree";
import { paragraphBr } from "./command/paragraph-br";
import {
  RichEditorGUIState,
  TiEditRichProseEmitter,
  TiEditRichProseProps,
} from "./ti-edit-rich-prose-types";
import { init_prose_editor } from "./init-prose-editor";

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
  // 内置子模型
  //-----------------------------------------------------
  let _doc_tree = useEditorDocTree(() => _view, _doc_tree_data);
  //-----------------------------------------------------
  // 动态操作编辑器
  //-----------------------------------------------------
  function select(from: number, to: number) {
    // 防空
    if (!_view) return;

    // 1. 获取状态接口
    const state = _view.state;

    // 2. 创建 TextSelection（文本选区）
    //const selection = TextSelection.create(state.doc, from, to);
    const selection = TextSelection.create(state.doc, 2, 3);

    // 3. 创建事务并设置选区
    const tr: Transaction = state.tr.setSelection(selection);

    // 4. 提交事务，更新编辑器状态
    _view.dispatch(tr);
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
    _view = init_prose_editor(props, $con, (tr) => {
      // 检查选择范围是否变化
      _doc_tree.updateTreeRoot(tr.selection, _checked_node_ids);
    });
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    TreeData: computed(() => _doc_tree_data.value),
    TreeCheckedIds: computed(() => _checked_node_ids.value),

    // 内置子模型
    Tree: _doc_tree,

    // 动态操作编辑器
    select,

    // 初始化操作
    initEditor,
    releaseEditor,
  };
}
