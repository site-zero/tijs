import _ from "lodash";
import { Ref } from "vue";
import { DefaultIdGetter, getDiffItemType, Match } from "..";
import { ConflictItem, DiffItem, TableRowID, TiMatch, Vars } from "../../_type";

export function has_conflict(cf?: ConflictItem): boolean {
  if (!cf || _.isEmpty(cf)) {
    return false;
  }
  if (cf.myDiffType != cf.taDiffType) {
    return true;
  }
  if (_.isEmpty(cf.fields)) {
    return false;
  }
  return true;
}

export function has_conflict_in(cfs?: ConflictItem[]): boolean {
  if (!cfs || _.isEmpty(cfs)) {
    return false;
  }
  for (let cf of cfs) {
    if (has_conflict(cf)) {
      return true;
    }
  }
  return false;
}

export function get_conflict_delta(data: Vars, conflict: ConflictItem): Vars {
  let conflictKeys = _.keys(conflict.fields);
  return _.omit(data, conflictKeys);
}

export function apply_conflict(
  local: Ref<Vars | undefined>,
  server?: Vars,
  localDiff?: DiffItem
) {
  // if (local.value && server && conflict) {
  //   // 没有冲突，就把本地修改直接融合到服务器上
  //   if (!conflict.fields || _.isEmpty(conflict.fields)) {
  //     local.value = _.assign({}, _.cloneDeep(server), localDiff);
  //   }
  //   // 更新本地修改没有冲突的部分
  //   else {
  //     let delta = get_conflict_delta(server, conflict);
  //     _.assign(local.value, delta);
  //   }
  // }
  if (local.value) {
    local.value = _.assign(_.cloneDeep(server), localDiff?.delta);
  }
}

export function apply_conflict_list(
  local: Ref<Vars[] | undefined>,
  server?: Vars[],
  localDiff?: DiffItem[]
) {
  if (!server || _.isEmpty(server)) {
    return;
  }
  // 编制冲突索引
  let deltaMap = new Map<string, Vars>();
  _.forEach(localDiff, (diffItem) => {
    if (diffItem.id && !_.isEmpty(diffItem.delta))
      deltaMap.set(diffItem.id as string, diffItem.delta!);
  });

  // 已 Server 为基础循环处理冲突项目
  let list = _.cloneDeep(server);
  for (let li of list) {
    let delta = deltaMap.get(li.id);
    _.assign(li, delta);
  }
  // 更新本地列表
  local.value = list;
}

/**
 * 创建冲突对象，用于比较两个变量对象中的键值对，找出值不同的冲突项。
 *
 * @param myData - 第一个变量对象，可选参数。
 * @param taData - 第二个变量对象，可选参数。
 * @returns 如果存在不同值的键值对，则返回一个记录对象，其中键为原键名，
 * 值为包含两个对象对应值的冲突项；如果任一输入对象为空或没有不同值，则返回 undefined。
 */
export function buildConflict(
  myDiff: DiffItem | undefined,
  taDiff: DiffItem | undefined,
  options: BuildConflictItemOptions
): ConflictItem | undefined {
  // 防空
  if (!myDiff || !taDiff) {
    return;
  }
  // 这个不太可能，报错
  if (myDiff.id != taDiff.id) {
    throw `Can only build conflict in same logic record: myId=${myDiff.id}, taId=${taDiff.id}`;
  }
  // 获取差异类型
  let myDiffType = getDiffItemType(myDiff);
  let taDiffType = getDiffItemType(taDiff);

  // 获取描述信息
  let item = taDiff.taData || taDiff.myData || myDiff.myData;
  let { getText, getHref } = options;
  let text = myDiff.id as string;
  if (getText && item) {
    text = getText(item);
  }

  // 获取超链接
  let href: string | undefined = undefined;
  if (getHref && item) {
    href = getHref(item);
  }

  // 准备返回值
  let re: ConflictItem = {
    id: myDiff.id,
    text,
    href,
    myDiffType,
    myDelta: myDiff.delta,
    taDiffType,
    taDelta: taDiff.delta,
    fields: {},
  };

  // 两边做了不同的操作:
  //  - 我插,它删
  //  - 我插,它改
  //  - 我改,它插
  //  - 我改,它删
  //  - 我删,它插
  //  - 我删,它改
  if (myDiffType != taDiffType) {
    return re;
  }
  // 两边同删
  if ("DELETE" == myDiffType) {
    return re;
  }
  // 两边同插同改
  else if ("INSERT" == myDiffType || "CHANGE" == myDiffType) {
    // 遍历键
    for (let myKey of Object.keys(myDiff.delta)) {
      let myValue = myDiff.delta[myKey];
      let taValue = taDiff.delta[myKey];

      if (
        !_.isUndefined(myValue) &&
        !_.isUndefined(taValue) &&
        !_.isEqual(myValue, taValue)
      ) {
        re.fields[myKey] = {
          myValue,
          taValue,
        };
      }
    }
  }
  // 不可能
  else {
    console.error(
      "Fail to makeConflic:",
      { myDiffType, taDiffType },
      { myDiff, taDiff }
    );
    throw "It is impossible!!";
  }

  // 搞定，返回
  return re;
}

export type BuildConflictItemOptions = {
  getText?: (item: Vars) => string;
  getHref?: (item: Vars) => string | undefined;
};

export type BuildConflictListOptions = BuildConflictItemOptions & {
  ignoreKeys?:
    | TiMatch
    | string
    | string[]
    | RegExp
    | ((key: string) => boolean);
  getId?: (it: Vars) => TableRowID;
};

export function buildConflictList(
  myList: DiffItem[],
  taList: DiffItem[],
  options: BuildConflictListOptions
): ConflictItem[] {
  // 准备参数
  options.ignoreKeys = Match.parse(options.ignoreKeys, false);
  const getItemId = options.getId ?? DefaultIdGetter;

  // 首先对于目标列表做索引
  let taMap = new Map<TableRowID, DiffItem>();
  for (let i = 0; i < taList.length; i++) {
    let ta = taList[i];
    let id = getItemId(ta);
    taMap.set(id, ta);
  }

  // 循环比较
  let re: ConflictItem[] = [];
  for (let i = 0; i < myList.length; i++) {
    let myData = myList[i];
    let myId = getItemId(myData);
    let taData = taMap.get(myId);
    if (!taData) {
      continue;
    }
    let conflict = buildConflict(myData, taData, options);
    if (conflict) {
      re.push(conflict);
    }
  }
  return re;
}
