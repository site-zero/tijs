import { TextSelection, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { computed, reactive, ref } from "vue";
import { EditorCommandsApi } from "./api/use-editor-commands";
import { useEditorDocTree } from "./api/use-editor-doc-tree";
import { useEditorDocSelection } from "./api/use-editor-selection";
import { useEditorToolbar } from "./api/use-editor-toolbar";
import { getContentConvertorMaker } from "./content";
import { init_prose_editor } from "./init-prose-editor";
import {
  EditorContentConvertor,
  EditorSchema,
  RichEditorGUIState,
  TiEditRichProseEmitter,
  TiEditRichProseProps,
} from "./ti-edit-rich-prose-types";

export type TiEditRichProseApi = ReturnType<typeof useTiEditRichProseApi>;

export function useTiEditRichProseApi(
  props: TiEditRichProseProps,
  getContainerElement: () => HTMLElement | null,
  emit: TiEditRichProseEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  let _view: EditorView | undefined = undefined;
  let _commands: EditorCommandsApi | undefined = undefined;
  let _schema: EditorSchema | undefined = undefined;
  //-----------------------------------------------------
  let _toolbar = useEditorToolbar();
  //-----------------------------------------------------
  let makeConvertor = getContentConvertorMaker(props.contentType || "json");
  let _convertor: EditorContentConvertor | undefined = undefined;
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
  const _ready = ref(false);
  // 文档结构树的数据
  const _doc_tree = useEditorDocTree(() => _view);
  // 文档当前选区
  const _doc_selection = useEditorDocSelection(_doc_tree);
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------

  //-----------------------------------------------------
  // 动态操作编辑器
  //-----------------------------------------------------
  function runCommand(commandName: string) {
    if (_view && _commands) {
      _commands.run(commandName, _view, onTransactionChange);
      _view.focus();
    }
    // const $main = getContainerElement();
    // if ($main) {
    //   const $con = Dom.find(":scope > .ProseMirror", $main);
    //   if ($con) {
    //     $con.focus();
    //   }
    // }
  }
  //-----------------------------------------------------
  function onTransactionChange(tr: Transaction) {
    // let from = tr.selection.from;
    // let to = tr.selection.to;
    //console.log("onTransactionChange", { from, to });
    // 检查选择范围是否变化
    _doc_tree.updateTree(tr.selection, _checked_node_ids);

    // 更新一下光标位置
    _doc_selection.update(tr);

    // 如果内容发生了改动，则获取最新内容
    if (tr.docChanged && _convertor) {
      const str = _convertor.render(tr.doc);
      //console.log("docChanged", str);
      emit("change", str);
    }
  }
  //-----------------------------------------------------
  function updateContent(str: string, resetCursor = 0) {
    //console.log("updateContent", { resetCursor });
    if (_view && _convertor) {
      let newDoc = _convertor.parse(str);

      // 替换整个文档
      let vws = _view.state;
      let docsz = vws.doc.content.size;
      const tr = vws.tr.replaceWith(0, docsz, newDoc.content);
      _view.dispatch(tr);

      // 更新文档结构树
      _doc_tree.updateTree({ from: 0, to: 0 }, _checked_node_ids);

      // 编辑器初始化完成后自动获得焦点
      // 将光标定位到第一个字符位置
      // ProseMirror中位置从1开始
      if (resetCursor > 0) {
        setCursor(resetCursor);
      }
    }
  }
  //-----------------------------------------------------
  // TODO 以后，靠里 pos 支持 [from,to] 这种形式
  function setCursor(pos: number) {
    //console.log("setCursor", pos);
    if (_view) {
      if (!_view.hasFocus()) {
        _view.focus();
      }
      const sel = TextSelection.create(_view.state.doc, pos);
      const tr = _view.state.tr.setSelection(sel);
      _view.dispatch(tr);
    }
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
    _ready.value = false;
    let $con = getContainerElement();
    if (!$con) {
      return;
    }
    if (_view) {
      console.log("initEditor:view already initialized");
      return;
    }

    // 确保释放所有已经分配的编辑器资源
    releaseEditor();

    // 通过一个回调函数，结合 _doc_tree 子模型
    // TODO 思考一下，是不是把 _doc_tree 传递过去改动更小呢？
    let reInit = init_prose_editor(props, $con, _toolbar, onTransactionChange);

    // 记录返回到上层闭包
    _view = reInit.view;
    _commands = reInit.commands;
    _schema = reInit.schema;
    _convertor = makeConvertor(props, _schema);
    _ready.value = true;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    isReady: computed(() => _ready.value),
    TreeData: computed(() => _doc_tree.DocTreeNodes.value),
    TreeCheckedIds: computed(() => _checked_node_ids.value),

    // 内置子模型
    Tree: _doc_tree,

    // 计算属性
    Selection: computed(() => _doc_selection.data.value),

    // 动态操作编辑器
    runCommand,
    updateContent,
    toolbar: _toolbar,

    // 初始化操作
    initEditor,
    releaseEditor,
  };
}
