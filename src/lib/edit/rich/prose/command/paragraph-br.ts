import { Command } from "prosemirror-state";

export const paragraphBr:Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.insertText("\n"));
  }
  return true;
}