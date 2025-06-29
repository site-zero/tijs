import { Command } from "prosemirror-state";

export const insert_br: Command = (state, dispatch) => {
  const { hard_break } = state.schema.nodes;
  const br = hard_break.create();
  const tr = state.tr.replaceSelectionWith(br).scrollIntoView();
  if (dispatch) {
    dispatch(tr);
  }
  return true;
};
