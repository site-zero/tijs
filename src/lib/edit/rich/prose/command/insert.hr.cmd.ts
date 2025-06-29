import { Command } from "prosemirror-state";

export const insert_hr: Command = (state, dispatch) => {
  const { horizontal_rule } = state.schema.nodes;
  const hr = horizontal_rule.create();
  const tr = state.tr.replaceSelectionWith(hr).scrollIntoView();
  if (dispatch) {
    dispatch(tr);
  }
  return true;
};
