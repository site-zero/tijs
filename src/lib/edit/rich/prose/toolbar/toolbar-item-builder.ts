import _ from "lodash";
import * as BLOCK from "./_block";
import * as EMBED from "./_embed";
import * as INLINE from "./_inline";
import * as OTHERS from "./_others";
import * as TABLE from "./_table";

export const _EDITOR_TOOLBAR_ITEMS = {
  // 分隔符,
  "|": {},

  // 内联
  ...INLINE,

  // 块操作
  ...BLOCK,
  ...TABLE,

  // 嵌入式对象
  ...EMBED,

  // 其他操作
  ...OTHERS,
};

type EDITOR_TOOLBAR_ITEMS = typeof _EDITOR_TOOLBAR_ITEMS;
export type EditorToolbarItemName = keyof EDITOR_TOOLBAR_ITEMS;

export function isEditorToolbarItemName(
  input?: any
): input is EditorToolbarItemName {
  if (!input) {
    return false;
  }
  if (_.isString(input) && _.get(_EDITOR_TOOLBAR_ITEMS, input)) {
    return true;
  }
  return false;
}
