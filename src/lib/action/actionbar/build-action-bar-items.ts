import _ from 'lodash';
import { useVisibility } from '../../';
import {
  ActionBarAction,
  ActionBarItem,
  ActionBarItemAltDisplay,
  Match,
  Util,
  Vars,
  isEventInfo,
  isInvoke,
} from '../../../core';
import {
  ABarAltDisplay,
  ABarParsedItem,
  ActionBarEmitter,
  ActionBarType,
} from './ti-action-bar-types';

function autoBarItemType(item: ActionBarItem): ActionBarType {
  if (item.items) {
    return 'group';
  }
  if (_.isEmpty(item)) {
    return 'sep';
  }
  return 'action';
}

// action?: Callback | EventInfo<any> | Invoke | string;
function makeItemAction(
  emit: ActionBarEmitter,
  action?: ActionBarAction
): ((vars: Vars) => void) | undefined {
  // Guard
  if (!action) {
    return;
  }

  // Callback
  if (_.isFunction(action)) {
    return action;
  }

  // EventInfo<any>
  if (isEventInfo<any>(action, (_it): _it is any => true)) {
    let ei = action;
    let eventName = ei.name;
    return (vars: Vars) => {
      let payload = Util.explainObj(vars, ei.payload, {
        evalFunc: false,
      });
      emit('fire', { eventName, payload });
    };
  }

  // Invoke
  if (isInvoke(action)) {
    return (vars: Vars) => {
      let fn = Util.genInvokingBy(action, {
        context: vars,
        dft: () => {
          throw new Error('fail to parse: ' + action);
        },
      });
      return fn();
    };
  }

  // String 作为事件名称
  let eventName = action;
  return (vars: Vars) => {
    emit('fire', { eventName, payload: vars });
  };
}

export function buildActionBarItems(
  indexes: number[],
  items: ActionBarItem[],
  emit: ActionBarEmitter,
  pItem?: ABarParsedItem
): ABarParsedItem[] {
  let re = [] as ABarParsedItem[];
  for (let index = 0; index < items.length; index++) {
    let it = items[index];

    // 项目类型
    let type = autoBarItemType(it);

    // 融合下标
    let selfIndexes = [...indexes, index];
    let uniqKey = `BAR_${selfIndexes.join('_')}`;
    let depth = indexes.length;

    // 准备显示项目
    let alts: ActionBarItemAltDisplay[] | undefined;
    let altDisplay: ABarAltDisplay[] | undefined;
    if (it.altDisplay) {
      alts = _.concat(it.altDisplay);
    }
    if (alts) {
      altDisplay = [];
      for (let alt of alts) {
        let a: ABarAltDisplay = {
          info: _.omit(alt, 'test'),
        };
        if (!_.isNil(alt.test)) {
          a.test = Match.parse(alt.test);
        }
        altDisplay.push(a);
      }
    }

    // 构建解析后项目
    let parsed = {
      //.....................................
      uniqKey,
      index,
      depth,
      type,
      aspect: 0 == depth ? 'top' : 'sub',
      axis: [],
      //.....................................
      icon: it.icon,
      text: it.text,
      className: it.className,
      style: it.style,
      tip: it.tip,
      //.....................................
      altDisplay,
      action: makeItemAction(emit, it.action),
      //.....................................
      ...useVisibility(it, uniqKey),
      //.....................................
    } as ABarParsedItem;

    // 建立祖先轴
    if (pItem) {
      parsed.axis.push(...pItem.axis, pItem.uniqKey);
    }

    // 尝试构建子项目
    if (it.items) {
      parsed.items = buildActionBarItems(selfIndexes, it.items, emit, parsed);
    }

    // 记入返回列表
    re.push(parsed);
  }
  return re;
}
