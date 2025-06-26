import { Command } from "prosemirror-state";

// export const paragraphBr: Command = (state, dispatch) => {
//   if (dispatch) {
//     dispatch(state.tr.insertText("\n"));
//   }
//   return true;
// };

export const br_command: Command = (state, dispatch) => {
  const { hard_break } = state.schema.nodes;
  const br = hard_break.create();
  const tr = state.tr.replaceSelectionWith(br).scrollIntoView();
  if (dispatch) {
    dispatch(tr);
  }
  return true;
};
