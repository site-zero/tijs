import _ from "lodash";
import { Match } from "..";
import {
  ConflictItem,
  ConflictItemValue,
  TableRowID,
  TiMatch,
  Vars,
} from "../../_type";

/**
 * 创建冲突对象，用于比较两个变量对象中的键值对，找出值不同的冲突项。
 *
 * @param myData - 第一个变量对象，可选参数。
 * @param taData - 第二个变量对象，可选参数。
 * @returns 如果存在不同值的键值对，则返回一个记录对象，其中键为原键名，
 * 值为包含两个对象对应值的冲突项；如果任一输入对象为空或没有不同值，则返回 undefined。
 */
export function makeConflict(
  myData?: Vars,
  taData?: Vars,
  ignoreKey?: TiMatch
): Record<string, ConflictItemValue> | undefined {
  // 防空
  if (!myData || !taData) {
    return;
  }
  // 准备返回值
  let re: Record<string, ConflictItemValue> = {};
  let _count = 0;

  // 遍历键
  for (let myKey of Object.keys(myData)) {
    if (ignoreKey && ignoreKey.test(myKey)) {
      continue;
    }
    let myValue = myData[myKey];
    let taValue = taData[myKey];

    if (
      !_.isUndefined(myValue) &&
      !_.isUndefined(taValue) &&
      !_.isEqual(myValue, taValue)
    ) {
      re[myKey] = {
        myValue,
        taValue,
      };
      _count++;
    }
  }

  // 搞定，返回
  if (_count > 0) {
    return re;
  }
}

export type MakeConflictSetup = {
  ignoreKeys?: string | string[] | RegExp | ((key: string) => boolean);
  getId: (it: Vars, index: number) => TableRowID;
};

export function makeConflictList(
  myList: Vars[],
  taList: Vars[],
  setup: MakeConflictSetup = { getId: (it) => it.id ?? it.value }
): ConflictItem[] {
  // 准备参数
  const ignoreKeys = Match.parse(setup.ignoreKeys, false);
  const getItemId = setup.getId ?? ((it) => it.id ?? it.value);

  // 首先对于目标列表做索引
  let taMap = new Map<TableRowID, Vars>();
  for (let i = 0; i < taList.length; i++) {
    let ta = taList[i];
    let id = getItemId(ta, i);
    taMap.set(id, ta);
  }

  // 循环比较
  let re: ConflictItem[] = [];
  for (let i = 0; i < myList.length; i++) {
    let myData = myList[i];
    let myId = getItemId(myData, i);
    let taData = taMap.get(myId);
    if (!taData) {
      continue;
    }
    let conflicts = makeConflict(myData, taData, ignoreKeys);
    if (conflicts) {
      re.push({
        index: i,
        id: myId,
        existsInMine: true,
        existsInThey: true,
        myData,
        taData,
        detail: conflicts,
      });
    }
  }
  return re;
}
