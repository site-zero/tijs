import _ from "lodash";
import { DefaultIdGetter, mapToObj, Match, Util } from "../";
import {
  DiffItem,
  DiffItemType,
  MakeDiffOptions,
  TableRowID,
  TiMatch,
  Vars,
} from "../../_type";

const debug = false;

export type RecordDiffOptions = {
  /**
   * 指示是否检查从原始记录中移除的项。所有被移除的项目，将用 null 返回
   * 默认为 true
   */
  checkRemoveFromOrgin?: boolean;
  /**
   * 指定需要忽略的键
   */
  ignoreKeys?:
    | TiMatch
    | string
    | string[]
    | RegExp
    | ((key: string) => boolean);
};

export function getRecordDiff(
  org: Vars,
  data: Vars,
  options: RecordDiffOptions = {}
): Vars {
  let { checkRemoveFromOrgin = true, ignoreKeys } = options;
  let ignore = Match.parse(ignoreKeys, false);
  let diff: Vars = {};
  // 看看哪些被修改了
  _.forEach(data, (v0, k) => {
    if (ignore && ignore.test(k)) {
      return;
    }
    let vOld = _.get(org, k);
    if (!_.isEqual(vOld, v0)) {
      _.set(diff, k, v0);
    }
  });
  // 看看哪些被删掉了
  if (checkRemoveFromOrgin) {
    _.forEach(org, (_v, k) => {
      if (ignore && ignore.test(k)) {
        return;
      }
      if (_.isUndefined(data[k])) {
        diff[k] = null;
      }
    });
  }
  return diff;
}

export function getRecordDiffDeeply(
  org: Vars,
  data: Vars,
  options: RecordDiffOptions = {}
): Vars {
  let { checkRemoveFromOrgin = true } = options;
  let diff: Vars = {};
  // 看看哪些被修改了
  _.forEach(data, (v0, k) => {
    let v_old = _.get(org, k);
    // 都是对象，递归
    if (_.isPlainObject(v_old) && _.isPlainObject(v0)) {
      let v_diff = getRecordDiffDeeply(v_old, v0, options);
      if (!_.isEmpty(v_diff)) {
        _.set(diff, k, v_diff);
        return;
      }
    }
    // 否则直判一下是否相等
    if (!_.isEqual(v_old, v0)) {
      _.set(diff, k, v0);
    }
  });
  // 看看哪些被删掉了
  if (checkRemoveFromOrgin) {
    _.forEach(org, (_v, k) => {
      if (_.isUndefined(data[k])) {
        diff[k] = null;
      }
    });
  }
  return diff;
}

export function setRecordEmptyToNull(obj: Vars) {
  _.forEach(obj, (v, k) => {
    if (_.isEmpty(v)) {
      obj[k] = null;
    }
  });
}

export function setMapEmptyToNull(map: Map<string, any>) {
  for (let [k, v] of map) {
    if (_.isEmpty(v)) {
      map.set(k, null);
    }
  }
}

export function isDeepEqual(o0: any, o1: any) {
  // undefined
  if (_.isUndefined(o0)) {
    return _.isUndefined(o1);
  }
  // null
  if (_.isNull(o0)) {
    return _.isNull(o1);
  }
  // 空字符串
  if ("" === o0) {
    return "" === o1;
  }
  // 0 值
  if (0 === o0) {
    return 0 === o1;
  }
  // 数组
  if (_.isArray(o0)) {
    if (!_.isArray(o1) || o0.length != o1.length) {
      return false;
    }
    for (let i = 0; i < o0.length; i++) {
      let v0 = o0[i];
      let v1 = o1[i];
      if (!isDeepEqual(v0, v1)) {
        return false;
      }
    }
    return true;
  }
  // 对象
  if (_.isPlainObject(o0)) {
    if (!_.isPlainObject(o1)) {
      return false;
    }
    let diff = getRecordDiffDeeply(o0, o1);
    return Object.keys(diff).length == 0;
  }
  // Map
  if (_.isMap(o0)) {
    if (!_.isMap(o1)) {
      return false;
    }
    let obj0 = mapToObj(o0);
    let obj1 = mapToObj(o1);
    let diff = getRecordDiffDeeply(obj0, obj1);
    return Object.keys(diff).length == 0;
  }
  // 集合
  if (_.isSet(o0)) {
    if (!_.isSet(o1) || o0.size != o1.size) {
      return false;
    }
    let list0 = [...o0];
    let list1 = [...o1];
    return isDeepEqual(list0, list1);
  }

  // 采用 JS 比较宽泛的比较一下
  return o0 == o1;
}

export function getDiffItemType(item: DiffItem): DiffItemType {
  if (item.existsInMine && item.existsInTarget) {
    return "CHANGE";
  }
  if (item.existsInMine && !item.existsInTarget) {
    return "INSERT";
  }
  if (!item.existsInMine && item.existsInTarget) {
    return "DELETE";
  }
  throw "It is impossible!!";
}

export type BuildDifferentItemOptions = MakeDiffOptions & {
  getId?: (it: Vars) => TableRowID;
  ignoreKeys?:
    | TiMatch
    | string
    | string[]
    | RegExp
    | ((key: string) => boolean);

  patchMetaUpdate?: null | ((diff: Vars, id: TableRowID, remote: Vars) => void);
};

export function buildDifferentItem(
  myData: Vars | undefined,
  taData: Vars | undefined,
  options: BuildDifferentItemOptions = {}
): DiffItem | undefined {
  if (debug) console.log("buildDifferentItem", { myData, taData });
  // 防空
  if (!myData && !taData) {
    return;
  }

  // 解析参数
  let {
    getId = DefaultIdGetter,
    ignoreKeys,
    defaultMeta,
    updateMeta,
    insertMeta,
    patchMetaUpdate,
  } = options;

  // 准备返回值
  let id = getId(myData ?? taData ?? {});
  let reDiffItem = {
    id,
    existsInMine: myData ? true : false,
    existsInTarget: taData ? true : false,
    myData: Util.jsonClone(myData),
    taData: Util.jsonClone(taData),
  } as DiffItem;
  if (debug) console.log("reDiffItem:", reDiffItem);

  // 自己不存在，那么必然 remote 存在, 相当于自己执行了删除
  if (!myData) {
    reDiffItem.delta = {};
  }
  // 两边都存在，则开始比较不同
  else if (taData) {
    let diff = Util.getRecordDiff(taData, myData, {
      checkRemoveFromOrgin: true,
      ignoreKeys,
    });
    if (_.isEmpty(diff)) {
      return;
    }

    // 补上固定 Meta
    if (defaultMeta) {
      // 动态计算
      if (_.isFunction(defaultMeta)) {
        _.defaults(diff, defaultMeta(myData, taData));
      }
      // 静态值
      else {
        _.defaults(diff, defaultMeta);
      }
    }
    if (updateMeta) {
      // 动态计算
      if (_.isFunction(updateMeta)) {
        _.assign(diff, updateMeta(myData, taData, diff));
      }
      // 静态值
      else {
        _.assign(diff, updateMeta);
      }
    }

    // 补上 ID
    if (patchMetaUpdate) {
      patchMetaUpdate(diff, id, taData);
    }

    reDiffItem.delta = diff;
  }
  // 必然是新记录，需要插入
  else {
    let newMeta = Util.jsonClone(myData);
    if (defaultMeta) {
      // 动态计算
      if (_.isFunction(defaultMeta)) {
        _.defaults(newMeta, defaultMeta(myData, taData));
      }
      // 静态值
      else {
        _.defaults(newMeta, defaultMeta);
      }
    }
    if (insertMeta) {
      // 动态计算
      if (_.isFunction(insertMeta)) {
        _.assign(newMeta, insertMeta(myData, taData));
      }
      // 静态值
      else {
        _.assign(newMeta, insertMeta);
      }
    }
    reDiffItem.delta = newMeta;
  }

  // 搞定返回
  return reDiffItem;
}

/**
 * 用于 `makeDifferents` 函数的配置对象类型
 * 包含本地列表、远程列表、远程映射、ID 获取函数和选项
 */
export type BuildDifferentListOptions = BuildDifferentItemOptions & {
  remoteMap?: Map<TableRowID, Vars>;
  /**
   * 找到一个差异就退出，通常适用于仅仅判断是否不同的场景
   * 各个模型的 isChanged 就是用这个计算的
   */
  findOneQuiet?: boolean;
};

/**
 * 构建本地列表和远程列表之间的差异项列表
 *
 * @param myList - 本地数据列表，可选参数
 * @param taList - 远程数据列表，可选参数
 * @param options - 构建差异项的配置选项，包含 ID 获取函数、远程映射等
 * @returns 返回一个包含差异项的数组
 */
export function buildDifferentListItems(
  myList: Vars[] | undefined,
  taList: Vars[] | undefined,
  options: BuildDifferentListOptions = {}
): DiffItem[] {
  let re: DiffItem[] = [];

  let { getId = DefaultIdGetter, remoteMap, ignoreKeys } = options;

  // 如果没有做过任何修改 ...
  if (!myList) {
    return re;
  }

  // 对远程列表编制索引
  if (!remoteMap) {
    remoteMap = buildMapFromList(getId, taList);
  }
  if (debug) console.log("remoteMap:", remoteMap);

  // 重新设置选项
  let diffItemOptions: BuildDifferentItemOptions = {
    ...options,
    ignoreKeys: Match.parse(ignoreKeys),
  };

  // 循环本地列表，顺便编制一个本地列表的ID 索引
  let localMap = new Map<TableRowID, Vars>();
  for (let i = 0; i < myList.length; i++) {
    let myData = myList[i];
    let id = getId(myData);
    localMap.set(id, myData);
    let taData = remoteMap.get(id);
    let diffItem = buildDifferentItem(myData, taData, diffItemOptions);
    if (diffItem) {
      re.push(diffItem);
      if (options.findOneQuiet) {
        return re;
      }
    }
  }
  if (debug) console.log("localMap:", localMap);

  // 循环一下，看看哪些需要从远程删除
  if (taList) {
    for (let i = 0; i < taList.length; i++) {
      let remote = taList[i];
      let id = getId(remote);
      let local = localMap.get(id);
      if (local) {
        continue;
      }
      if (debug) console.log("rm from taList: i=", i, id, remote);
      let diffItem = buildDifferentItem(local, remote, diffItemOptions);
      if (debug) console.log("diffItem", diffItem);
      if (diffItem) {
        re.push(diffItem);
        if (options.findOneQuiet) {
          return re;
        }
      }
    }
  }

  return re;
}

/**
 * 根据给定的列表和 ID 获取函数构建一个 Map
 * @param list - 包含数据的数组
 * @param getId - 用于从数组元素中获取 ID 的函数，接收元素和索引作为参数
 * @returns 一个以 ID 为键，数组元素为值的 Map
 */
export function buildMapFromList(
  getId: (it: Vars, index: number) => TableRowID,
  list?: Vars[]
): Map<TableRowID, Vars> {
  let re = new Map<TableRowID, Vars>();
  if (list) {
    for (let i = 0; i < list.length; i++) {
      let remote = list[i];
      let id = getId(remote, i);
      re.set(id, remote);
    }
  }
  return re;
}
