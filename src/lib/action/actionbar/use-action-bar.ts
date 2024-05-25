import _ from 'lodash';
import {
  ABarItemOpenStatus,
  ABarParsedItem,
  ABarState,
  ABarUsedItem,
} from './ti-action-bar-types';

export function useActionBar(
  items: ABarParsedItem[],
  state: ABarState
): ABarUsedItem[] {
  let re = [] as ABarUsedItem[];
  for (let it of items) {
    let newItem = _.cloneDeep(
      _.omit(it, 'isDisabled', 'isHidden', 'items', 'altDisplay')
    ) as ABarUsedItem;

    // ............... 可见性
    newItem.hidden = it.isHidden(state.vars);
    newItem.disabled = it.isDisabled(state.vars);

    // ............... 使用 altDisplay
    if (it.altDisplay) {
      for (let alt of it.altDisplay) {
        if (!alt.test || alt.test.test(state.vars)) {
          _.assign(newItem, alt.info);
          break;
        }
      }
    }

    // ............... 建立子项目
    if (it.items) {
      newItem.items = useActionBar(it.items, state);
    }

    // ............... 记入列表
    re.push(newItem);
  }
  return re;
}

export function hasOpenedGroup(
  opened: Map<string, ABarItemOpenStatus>
): boolean {
  for (let [_k, openStatus] of opened.entries()) {
    if ('opened' == openStatus) {
      return true;
    }
  }
  return false;
}

export function openBarItem(state: ABarState, it: ABarUsedItem) {
  let keys = [...it.axis, it.uniqKey];
  clearBarOpenStateExcept(state, keys);
  setBarOpenState(state, it.axis, 'ready');
  state.opened.set(it.uniqKey, 'opened');
}


function setBarOpenState(
  state: ABarState,
  uniqKeys: string[],
  status: ABarItemOpenStatus | null
) {
  if (!status) {
    for (let uk of uniqKeys) {
      state.opened.delete(uk);
    }
  } else {
    for (let uk of uniqKeys) {
      state.opened.set(uk, status);
    }
  }
}

function clearBarOpenStateExcept(state: ABarState, uniqKeys: string[]) {
  let ignore_keys = new Map<string, boolean>();
  for (let uniqKey of uniqKeys) {
    ignore_keys.set(uniqKey, true);
  }
  for (let en of state.opened.entries()) {
    let [k] = en;
    if (!ignore_keys.get(k)) {
      state.opened.delete(k);
    }
  }
}
