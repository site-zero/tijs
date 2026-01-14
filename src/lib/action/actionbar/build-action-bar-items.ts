import _ from "lodash";
import { ActionBarProps, useVisibility } from "../../";
import {
  ActionBarAction,
  ActionBarCallback,
  ActionBarItem,
  ActionBarItemAltDisplay,
  TiAppBus,
  Vars,
  isActionEventInfo,
  isInvoke,
} from "../../../_type";
import { CssUtils, Match, Util } from "../../../core";
import {
  ABarAltDisplay,
  ABarParsedItem,
  ActionBarEmitter,
  ActionBarItemRefer,
  ActionBarLayoutMode,
  ActionBarType,
} from "./ti-action-bar-types";

function autoBarItemType(item: ActionBarItem): ActionBarType {
  let type = item.type;

  // 用户指定类型
  if (type && "auto" != type) {
    return type;
  }
  // 自动判断类型: 自定义
  if (item.comType) {
    return "customized";
  }

  // 自动判断类型: 带分组
  if (item.items) {
    return "group";
  }

  // 自动判断类型: 分隔线
  if (_.isEmpty(item) || "sep" == item.type) {
    return "sep";
  }

  // 自动判断类型: 默认为普通动作菜单项
  return "action";
}

// action?: Callback | EventInfo<any> | Invoke | string;
function makeItemAction(
  emit: ActionBarEmitter,
  action?: ActionBarAction
): ActionBarCallback | undefined {
  // Guard
  if (!action) {
    return;
  }

  // Callback
  if (_.isFunction(action)) {
    return action;
  }

  // EventInfo<any>
  if (isActionEventInfo(action)) {
    let ei = action;
    let eventName = ei.name;

    let getPayload = function (value: any, vars: Vars) {
      let payload = ei.payload;
      // 未指定 payload 那么就尝试通过值啥的搞一个
      if (_.isNil(payload)) {
        if (_.isNil(value)) {
          return _.cloneDeep(vars || {});
        }
        return value;
      }
      // 动态负载，解析一下
      if (ei.dynamic) {
        payload = Util.explainObj({ value, vars }, ei.payload, {
          evalFunc: false,
        });
      }
      return payload;
    };

    // 总线事件
    if (action.bus) {
      return (value: any, vars: Vars, bus?: TiAppBus) => {
        if (!bus) {
          console.warn(`need bug to notify [${action}]`);
          return;
        }
        let payload = getPayload(value, vars);
        bus.emit(eventName, payload);
      };
    }
    // 当做普通事件
    else {
      return (value: any, vars: Vars) => {
        let payload = getPayload(value, vars);
        emit("fire", { name: eventName, payload });
      };
    }
  }

  // Invoke
  if (isInvoke(action)) {
    return (vars: Vars) => {
      let fn = Util.genInvokingBy(action, {
        context: vars,
        dft: () => {
          throw new Error("fail to parse: " + action);
        },
      });
      return fn();
    };
  }

  // String 作为事件名称
  let eventName = action;
  return (vars: Vars) => {
    emit("fire", { name: eventName, payload: vars });
  };
}

function makeItemActionWithDebounce(
  emit: ActionBarEmitter,
  action?: ActionBarAction,
  debounce = 1000
): ActionBarCallback | undefined {
  let fn = makeItemAction(emit, action);
  if (!fn) {
    return;
  }
  if (debounce > 0) {
    return _.debounce(fn, debounce, {
      leading: true,
      trailing: false,
    });
  }
  return fn;
}

function _get_bar_item(
  props: ActionBarProps,
  key: string,
  setup: Partial<ActionBarItem> = {}
): ActionBarItem {
  // 木有，那么就直接当做静态项目了
  if (!props.barItemSet) {
    if (_.isEmpty(key)) {
      return setup || {};
    }
    return _.assign(setup, { text: key } as ActionBarItem);
  }
  // 定制
  if (_.isFunction(props.barItemSet)) {
    return props.barItemSet(key, setup);
  }

  // 一个固定菜单项集合
  let item = props.barItemSet[key];
  if (!item) {
    if (_.isEmpty(key)) {
      return setup || {};
    }
    return _.assign(setup, { text: key } as ActionBarItem);
  }
  return _.assign({}, item, setup);
}

export function buildActionBarItems(
  props: ActionBarProps,
  indexes: number[],
  items: ActionBarItemRefer[],
  layoutMode: ActionBarLayoutMode,
  emit: ActionBarEmitter,
  pItem?: ABarParsedItem
): ABarParsedItem[] {
  let re = [] as ABarParsedItem[];
  for (let index = 0; index < items.length; index++) {
    let _it_ref = items[index];

    let it: ActionBarItem;
    // 转换为输入 Item
    if (_.isString(_it_ref)) {
      it = _get_bar_item(props, _it_ref);
    }
    // 修饰
    else if (_.isArray(_it_ref)) {
      it = _get_bar_item(props, _it_ref[0], _it_ref[1]);
    }
    // 直接指定的菜单项
    else {
      it = _it_ref;
    }

    // 项目类型
    let type = autoBarItemType(it);

    // 融合下标
    let selfIndexes = [...indexes, index];
    let uniqKey = `BAR_${selfIndexes.join("_")}`;
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
          info: _.omit(alt, "test"),
        };
        if (!_.isNil(alt.test)) {
          a.test = Match.parse(alt.test);
        }
        a.info.className = CssUtils.mergeClassName(
          {},
          a.info.className,
          `item-r-${props.itemRadius ?? "s"}`
        );
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
      aspect: 0 == depth ? "top" : "sub",
      layoutMode,
      axis: [],
      //.....................................
      icon: it.icon,
      text: it.text,
      className: CssUtils.mergeClassName(
        {},
        it.className,
        `item-r-${props.itemRadius ?? "s"}`
      ),
      style: it.style,
      tip: it.tip,
      //.....................................
      altDisplay,
      //.....................................
      explainOptions: it.explainOptions,
      vars: it.vars,
      comType: it.comType,
      comConf: it.comConf,
      readonlyComType: it.readonlyComType,
      readonlyComConf: it.readonlyComConf,
      changeEventName: it.changeEventName,
      //.....................................
      action: makeItemActionWithDebounce(emit, it.action, it.debounce),
      value: it.value,
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
      parsed.items = buildActionBarItems(
        props,
        selfIndexes,
        it.items,
        layoutMode,
        emit,
        parsed
      );
    }

    // 记入返回列表
    re.push(parsed);
  }
  return re;
}
