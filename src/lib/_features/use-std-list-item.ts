import _ from 'lodash';
import {
  Convertor,
  IconInput,
  StdOptionItem,
  TableRowID,
  Vars,
} from '../../core';

export type StdListItemProps = {
  /**
   * 从指定的对象获取显示图标
   * 默认，相当于 `icon`
   */
  getIcon?: string | Convertor<Vars, IconInput | undefined>;
  /**
   * 从指定的对象获取显示文本
   * 默认，相当于 `text`
   */
  getText?: string | Convertor<Vars, string | undefined>;

  /**
   * 从指定的对象获取显示提示信息
   * 默认，相当于 `tip`
   */
  getTip?: string | Convertor<Vars, string | undefined>;

  /**
   * 从指定的对象获取显示提示信息
   * 默认，相当于 `tip`
   */
  getValue?: string | Convertor<Vars, TableRowID | undefined>;
};

export type StdListItemFeature = {
  getItemValue: (it: Vars) => TableRowID | undefined;
  getItemIcon: (it: Vars) => IconInput | undefined;
  getItemText: (it: Vars) => string | undefined;
  getItemTip: (it: Vars) => string | undefined;
  toStdItem: (it: Vars) => StdOptionItem;
  toStdItems: (list: Vars[]) => StdOptionItem[];
};

export function useStdListItem(props: StdListItemProps): StdListItemFeature {
  let {
    getIcon = (item: Vars) => item.icon,
    getText = (item: Vars) => item.text ?? item.title ?? item.nickname,
    getTip = (item: Vars) => item.tip,
    getValue = (item: Vars) => item.value ?? item.id,
  } = props;

  function getItemValue(it: Vars): TableRowID | undefined {
    if (getValue) {
      if (_.isString(getValue)) {
        return _.get(it, getValue);
      }
      return getValue(it);
    }
  }

  function getItemIcon(it: Vars): IconInput | undefined {
    if (getIcon) {
      if (_.isString(getIcon)) {
        return _.get(it, getIcon);
      }
      return getIcon(it);
    }
  }

  function getItemText(it: Vars): string | undefined {
    if (getText) {
      if (_.isString(getText)) {
        return _.get(it, getText);
      }
      return getText(it);
    }
  }

  function getItemTip(it: Vars): string | undefined {
    if (getTip) {
      if (_.isString(getTip)) {
        return _.get(it, getTip);
      }
      return getTip(it);
    }
  }

  function toStdItem(it: Vars): StdOptionItem {
    return {
      icon: getItemIcon(it),
      text: getItemText(it),
      tip: getItemTip(it),
      value: getItemValue(it)!,
    };
  }

  function toStdItems(list: Vars[]): StdOptionItem[] {
    let re = [] as StdOptionItem[];
    for (let li of list) {
      re.push(toStdItem(li));
    }
    return re;
  }

  return {
    getItemValue,
    getItemIcon,
    getItemText,
    getItemTip,
    toStdItem,
    toStdItems,
  };
}
