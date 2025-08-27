import _ from "lodash";
import { Util } from "../";
import { TableRowID, TextStrValue } from "../../_type";

/***
 * 将一组值推到一个对象的某个指定键下,
 * 并确保值是个数组。
 *
 * @param obj 目标对象
 * @param key 键名
 * @param vals 值
 *
 * @returns 目标对象自身
 */
export function pushEle(
  obj = {} as {
    [k: string]: any;
  },
  key: string,
  ...vals: any[]
) {
  // Guard
  if (!vals || vals.length == 0) {
    return;
  }
  // Set
  let vs = obj[key];
  if (_.isArray(vs)) {
    for (let i = 0; i < vals.length; i++) {
      vs.push(vals[i]);
    }
  }
  // vs is not array
  else if (vs) {
    vs = [vs];
    for (let i = 0; i < vals.length; i++) {
      vs.push(vals[i]);
    }
  }
  // vs is empty
  else {
    vs = vals;
  }
  // Done
  obj[key] = vs;
  return obj;
}

interface GroupingOptions {
  titles?: TextStrValue[];
  otherTitle?: TextStrValue;
  asList?: boolean;
}
type GroupingReturn = {
  text: string;
  value: string;
  list: any[];
};

/**
 * 根据指定规则，对输入的列表进行分组
 *
 * @param list 输入的对象列表
 * @param groupKey 分组键, 没有分组键的对象会被分到 `others` 类中
 * @param options 分组选项
 * @returns 整理后的结果
 */
export function grouping(
  list: any[] = [],
  groupKey: string,
  options: GroupingOptions | undefined
):
  | {
      [k: string]: GroupingReturn;
    }
  | GroupingReturn[] {
  //...............................................
  let {
    titles = [],
    otherTitle = { value: "Others", text: "Others" },
    asList = false,
  } = options || {};
  //...............................................
  let reMap = {} as {
    [k: string]: GroupingReturn;
  };
  //...............................................
  // Build title map
  let titleMap = {} as {
    [k: string]: TextStrValue;
  };
  _.forEach(titles, (tit) => {
    if (tit.text && !_.isNil(tit.value)) {
      titleMap[tit.value] = tit;
    }
  });
  //console.log("titleMap", titleMap);
  //...............................................
  let others = [] as any[];
  //...............................................
  _.forEach(list, (li) => {
    let gk = _.get(li, groupKey);
    if (!gk) {
      others.push(li);
    }
    // 创建新的归类组，如果没有指定组标题，则自动用值作为标题
    else {
      let tit = titleMap[gk] || { text: gk, value: gk };
      let grp = reMap[gk];
      if (!grp) {
        grp = {
          ...tit,
          list: [],
        };
        reMap[gk] = grp;
      }
      grp.list.push(li);
    }
  });
  //...............................................
  if (!_.isEmpty(others)) {
    reMap[otherTitle.value] = {
      ...otherTitle,
      list: others,
    };
  }
  //...............................................
  if (asList) {
    return _.values(reMap);
  }
  return reMap;
}

/**
 * 在列表中查找指定 ID 的项的索引
 *
 * @param list 输入的列表
 * @param itemId 需要查找的项的 ID
 * @param getId 可选参数，用于从列表项中获取 ID 的函数，默认尝试获取 'id' 或 'value' 属性
 * @returns 找到则返回对应索引，未找到则返回 -1
 */
export function getItemIndex<T>(
  list: T[],
  itemId?: TableRowID,
  getId?: (it: T, index: number) => undefined | null | TableRowID
): number {
  if (_.isNil(itemId)) {
    return -1;
  }
  const _get_item_id = getId ?? ((it: any) => it.id ?? it.value);
  for (let i = 0; i < list.length; i++) {
    let id = _get_item_id(list[i], i);
    if (id === itemId) {
      return i;
    }
  }
  return -1;
}

/**
 * 根据最后一个选中的 ID，在列表中查找下一个未选中的项的 ID
 * 若向后未找到，则向前查找
 *
 * @param list 输入的列表
 * @param checkedIds 已选中的项的 ID 或 ID 列表
 * @param getId 可选参数，用于从列表项中获取 ID 的函数，默认尝试获取 'id' 或 'value' 属性
 * @returns 找到则返回对应 ID，未找到则返回 undefined
 */
export function getNextId<T>(
  list: T[],
  checkedIds?: TableRowID | TableRowID[] | undefined | null,
  getId?: (it: T, index: number) => undefined | null | TableRowID
): TableRowID | undefined {
  // 归一化参数
  let _ids = _.isNil(checkedIds)
    ? []
    : _.isArray(checkedIds)
    ? checkedIds
    : [checkedIds];

  // 防空
  if (_.isEmpty(_ids) || _.isEmpty(list)) {
    return;
  }

  // 编制索引
  let idMap = Util.arrayToMap(_ids);
  let lastId = _.last(_ids);

  // 获取 ID 的方法
  const _get_item_id =
    getId ?? ((it: any, index: number) => it.id ?? it.value ?? `row-${index}`);

  // 开始查找
  let index = getItemIndex(list, lastId!, _get_item_id);
  if (index < 0) {
    return;
  }

  // 向后找，遇到第一个非选中的对象ID
  for (let i = index + 1; i < list.length; i++) {
    let id = _get_item_id(list[i], i);
    if (!idMap.has(id)) {
      return id;
    }
  }

  // 向前找，遇到第一个非选中的对象ID
  for (let i = index - 1; i >= 0; i--) {
    let id = _get_item_id(list[i], i);
    if (!idMap.has(id)) {
      return id;
    }
  }
}

/**
 * 根据 ID 移动已选中的项
 *
 * @param list 输入的列表
 * @param ids 需要移动的项的 ID 列表
 * @param dir 移动方向，可选值为 'prev'、'next'、'head'、'tail'
 * @param getId 可选参数，用于从列表项中获取 ID 的函数，默认尝试获取 'id' 或 'value' 属性
 * @returns 移动后的新列表
 */
export function moveCheckedById<T>(
  list: T[],
  ids: TableRowID[],
  dir: MoveDirection,
  getId?: (it: T) => TableRowID
) {
  if (!getId) {
    getId = (it: T) => {
      if (_.isString(it) || _.isNumber(it)) {
        return it as TableRowID;
      }
      return (_.get(it, "id") ?? _.get(it, "value")) as TableRowID;
    };
  }
  const idSet = Util.arrayToSet(ids);
  const isChecked = (it: T) => {
    if (_.isNil(it) || !getId) {
      return false;
    }
    let id = getId(it);
    return idSet.has(id);
  };
  return moveChecked(list, isChecked, dir);
}

export type MoveDirection = "prev" | "next" | "head" | "tail";

/**
 * 根据检查函数移动已选中的项
 *
 * @param list 输入的列表
 * @param isChecked 用于检查列表项是否需要移动的函数
 * @param dir 移动方向，可选值为 'prev'、'next'、'head'、'tail'
 * @returns 移动后的新列表
 */
export function moveChecked<T>(
  list: T[],
  isChecked: (it: T) => boolean,
  dir: MoveDirection
): T[] {
  // 寻找开始以及结束下标
  let I_start = -1;
  let I_end = -1;
  let checks = [] as T[];
  let re = [] as any[];
  for (let i = 0; i < list.length; i++) {
    let li = list[i];
    if (isChecked(li)) {
      I_end = i;
      if (I_start < 0) {
        I_start = i;
      }
      checks.push(_.cloneDeep(li));
      re.push(undefined);
    }
    // 记录
    else {
      re.push(_.cloneDeep(li));
    }
  }

  // 木有找到
  if (I_start < 0) {
    return list;
  }

  // 开始移动
  let prevI = Math.max(0, I_start - 1);
  let fns = {
    prev: () => {
      re.splice(prevI, 0, ...checks);
    },
    next: () => {
      re.splice(I_end + 2, 0, ...checks);
    },
    head: () => {
      re.splice(0, 0, ...checks);
    },
    tail: () => {
      re.push(...checks);
    },
  } as Record<MoveDirection, () => void>;

  // 执行算法
  fns[dir]();

  return _.without(re, undefined);
}
