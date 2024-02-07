import _ from 'lodash';
import { TextStrValue } from '../ti';

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
  options: GroupingOptions | undefined,
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
