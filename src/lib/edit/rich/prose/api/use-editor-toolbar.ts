import _ from "lodash";
import { ActionBarItem } from "../../../../../_type";
import { Util } from "../../../../../core";
import { EditorToolbarItem } from "../ti-edit-rich-prose-types";
import * as BLOCK from "../toolbar/_block";
import * as EMBED from "../toolbar/_embed";
import * as INLINE from "../toolbar/_inline";
import * as OTHERS from "../toolbar/_others";
import * as TABLE from "../toolbar/_table";

export type EditorToolbarApi = ReturnType<typeof useEditorToolbar>;

export function useEditorToolbar() {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _toolbarItems: Map<string, ActionBarItem> = Util.objToMap({
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
  });
  //-----------------------------------------------------
  function get(key: string) {
    return _toolbarItems.get(key);
  }
  //-----------------------------------------------------
  function set(key: string, item: ActionBarItem) {
    _toolbarItems.set(key, item);
  }
  //-----------------------------------------------------
  function remove(...keys: string[]) {
    for (let k of keys) {
      _toolbarItems.delete(k);
    }
  }
  //-----------------------------------------------------
  function createEditorToolbarItem(
    input: EditorToolbarItem
  ): ActionBarItem | undefined {
    if (_.isArray(input)) {
      return {
        type: "combin",
        items: buildEditorToolbarItem(input),
      };
    }
    if (_.isString(input)) {
      return _.cloneDeep(_toolbarItems.get(input));
    }
    return _.cloneDeep(input);
  }
  //-----------------------------------------------------
  function buildEditorToolbarItem(
    toolbar: EditorToolbarItem[] | undefined | null
  ): ActionBarItem[] {
    let items: ActionBarItem[] = [];
    if (toolbar) {
      for (let barItem of toolbar) {
        const item = createEditorToolbarItem(barItem);
        if (item) {
          items.push(item);
        } else {
          console.warn(`Fail to found toolbar Item ${JSON.stringify(barItem)}`);
        }
      }
    }
    return items;
  }

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    _toolbarItems,
    buildEditorToolbarItem,
    get,
    set,
    remove,
  };
}
