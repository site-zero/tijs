import _ from "lodash";
import { mapToObj, Util } from "../";
import { DiffItem, MakeDiffOptions, TableRowID, Vars } from "../../_type";

export type RecordDiffOptions = {
  /**
   * 指示是否检查从原始记录中移除的项。所有被移除的项目，将用 null 返回
   * 默认为 true
   */
  checkRemoveFromOrgin?: boolean;
};

export function getRecordDiff(
  org: Vars,
  data: Vars,
  options: RecordDiffOptions = {}
): Vars {
  let { checkRemoveFromOrgin = true } = options;
  let diff: Vars = {};
  // 看看哪些被修改了
  _.forEach(data, (v0, k) => {
    let vOld = _.get(org, k);
    if (!_.isEqual(vOld, v0)) {
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

/**
 * 用于 `makeDifferents` 函数的配置对象类型
 * 包含本地列表、远程列表、远程映射、ID 获取函数和选项
 */
export type MakeDiffSetup = {
  localList?: Vars[];
  remoteList?: Vars[];
  remoteMap?: Map<TableRowID, Vars>;
  getId: (it: Vars, index: number) => TableRowID;
  options: MakeDiffOptions;
  patchMetaUpdate?: null | ((diff: Vars, id: TableRowID, remote: Vars) => void);
};

export function makeDifferents(setup: MakeDiffSetup): DiffItem[] {
  let re: DiffItem[] = [];

  let { localList, remoteList, remoteMap, getId, options, patchMetaUpdate } =
    setup;

  // 如果没有做过任何修改 ...
  if (!localList) {
    return re;
  }

  // 对远程列表编制索引
  if (!remoteMap) {
    remoteMap = buildMapFromList(getId, remoteList);
  }

  // 循环本地列表，顺便编制一个本地列表的ID 索引
  let localMap = new Map<TableRowID, Vars>();
  if (localList) {
    for (let i = 0; i < localList.length; i++) {
      let local = localList[i];
      let id = getId(local, i);
      localMap.set(id, local);
      let remote = remoteMap.get(id);
      let diffItem = {
        index: i,
        id,
        existsInRemote: remote ? true : false,
        existsInLocal: true,
        local: Util.jsonClone(local),
        remote: Util.jsonClone(remote),
      } as DiffItem;
      // 已经存在，必然是要更新记录
      if (remote) {
        let diff = Util.getRecordDiff(remote, local, {
          checkRemoveFromOrgin: true,
        });
        if (_.isEmpty(diff)) {
          continue;
        }

        // 补上固定 Meta
        if (options.defaultMeta) {
          // 动态计算
          if (_.isFunction(options.defaultMeta)) {
            _.defaults(diff, options.defaultMeta(local, remote));
          }
          // 静态值
          else {
            _.defaults(diff, options.defaultMeta);
          }
        }
        if (options.updateMeta) {
          // 动态计算
          if (_.isFunction(options.updateMeta)) {
            _.assign(diff, options.updateMeta(local, remote));
          }
          // 静态值
          else {
            _.assign(diff, options.updateMeta);
          }
        }

        // 补上 ID
        if (patchMetaUpdate) {
          patchMetaUpdate(diff, id, remote);
        }

        diffItem.delta = diff;
      }
      // 必然是新记录，需要插入
      else {
        let newMeta = Util.jsonClone(local);
        if (options.defaultMeta) {
          // 动态计算
          if (_.isFunction(options.defaultMeta)) {
            _.defaults(newMeta, options.defaultMeta(local, remote));
          }
          // 静态值
          else {
            _.defaults(newMeta, options.defaultMeta);
          }
        }
        if (options.insertMeta) {
          // 动态计算
          if (_.isFunction(options.insertMeta)) {
            _.assign(newMeta, options.insertMeta(local, remote));
          }
          // 静态值
          else {
            _.assign(newMeta, options.insertMeta);
          }
        }
        diffItem.delta = newMeta;
      }
      // 记入返回列表
      re.push(diffItem);
    } // for (let i = 0; i < _local_list.value.length; i++) {
  }

  // 循环一下，看看哪些需要从远程删除
  if (remoteList) {
    for (let i = 0; i < remoteList.length; i++) {
      let remote = remoteList[i];
      let id = getId(remote, i);
      let local = localMap.get(id);
      if (!local) {
        re.push({
          index: -1,
          id,
          existsInRemote: true,
          existsInLocal: false,
          local: {},
          delta: {},
          remote: Util.jsonClone(remote),
        });
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
