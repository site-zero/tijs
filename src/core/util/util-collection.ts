import _ from 'lodash';
import { TableRowID, TextStrValue, Util } from '../ti';

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
    otherTitle = { value: 'Others', text: 'Others' },
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
 *
 * @param list
 * @param ids
 * @param dir
 * @param getId
 * @returns
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
      return (_.get(it, 'id') ?? _.get(it, 'value')) as TableRowID;
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

export type MoveDirection = 'prev' | 'next' | 'head' | 'tail';

/**
 *
 * @param list
 * @param isChecked
 * @param dir
 * @returns
 */
export function moveChecked<T>(
  list: T[],
  isChecked: (it: T) => boolean,
  dir: MoveDirection
) {
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
    return;
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
