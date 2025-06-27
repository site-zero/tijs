import _ from "lodash";
import BLOCKQUOTE from "./block/blockquote";
import HEADING from "./block/heading";
import TABLE from "./block/table";
import IMAGE from "./embed/image";
import BOLD from "./inline/bold";
import ITALIC from "./inline/italic";
import LINK from "./inline/link";
import UNDERLINED from "./inline/underlined";
import REDO from "./other/redo";
import UNDO from "./other/undo";

export const _EDITOR_TOOLBAR_ITEMS = {
  // 分隔符,
  "|": {},
  // 内联
  "B": BOLD,
  "I": ITALIC,
  "U": UNDERLINED,
  "link": LINK,

  // 块操作
  "blockquote": BLOCKQUOTE,
  "table": TABLE,
  "heading": HEADING,

  // 嵌入式对象
  "image": IMAGE,

  // 其他操作
  "undo": UNDO,
  "redo": REDO,
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
