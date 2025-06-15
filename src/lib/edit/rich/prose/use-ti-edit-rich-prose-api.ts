import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {
  TiEditRichProseEmitter,
  TiEditRichProseProps,
} from "./ti-edit-rich-prose-types";
import { ref } from "vue";

export type TiEditRichProseApi = ReturnType<typeof useTiEditRichProseApi>;

export function useTiEditRichProseApi(
  _props: TiEditRichProseProps,
  getContainerElement: () => HTMLElement | null,
  _emit: TiEditRichProseEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  let _state = ref<EditorState>();
  let _view = ref<EditorView>();
  //-----------------------------------------------------
  function initEditor() {
    let $con = getContainerElement();
    if (!$con) {
      return;
    }
    _state.value = EditorState.create({ schema });
    _view.value = new EditorView($con, {
      state: _state.value,
      dispatchTransaction(tr) {
        console.log(
          "Document size went from",
          tr.before.content.size,
          "to",
          tr.doc.content.size
        );
        let newState = _view.value!.state.apply(tr);
        _view.value!.updateState(newState);
      },
    });
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    initEditor,
  };
}
