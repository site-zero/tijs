import _ from "lodash";
import { ActionBarItem } from "../../../../../";
import { EditorToolbarItem } from "../ti-edit-rich-prose-types";
import {
  _EDITOR_TOOLBAR_ITEMS,
  isEditorToolbarItemName,
} from "./toolbar-item-builder";

export function createEditorToolbarItem(
  input: EditorToolbarItem
): ActionBarItem {
  if (_.isArray(input)) {
    return {
      type: "combin",
      items: buildEditorToolbarItem(input),
    };
  }
  if (isEditorToolbarItemName(input)) {
    return _.cloneDeep(_EDITOR_TOOLBAR_ITEMS[input]);
  }
  return _.cloneDeep(input);
}

export function buildEditorToolbarItem(
  toolbar: EditorToolbarItem[] | undefined | null
): ActionBarItem[] {
  let items: ActionBarItem[] = [];
  if (toolbar) {
    for (let barItem of toolbar) {
      items.push(createEditorToolbarItem(barItem));
    }
  }
  return items;
}
