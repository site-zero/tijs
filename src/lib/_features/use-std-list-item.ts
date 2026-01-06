import _ from "lodash";
import {
  Convertor,
  IconInput,
  isStdOptionItem,
  StdOptionItem,
  TableRowID,
  Vars,
} from "../../_type";

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
  getValue?: string | ((item: Vars, index: number) => TableRowID);
};

export type StdListItemFeature = ReturnType<typeof useStdListItem>;

export function useStdListItem(props: StdListItemProps) {
  let {
    getIcon = (item: Vars) => item.icon,
    getText = (item: Vars) => item.text ?? item.title ?? item.nickname,
    getTip = (item: Vars) => item.tip,
    getValue = (item: Vars, index: number) => item.value ?? item.id ?? index,
  } = props;

  function getItemValue(it: Vars, index: number): TableRowID {
    if (getValue) {
      if (_.isString(getValue)) {
        return _.get(it, getValue) ?? index;
      }
      return getValue(it, index) ?? index;
    }
    return index;
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

  function toStdItem(it: Vars, index: number): StdOptionItem {
    if (isStdOptionItem(it)) {
      return it;
    }
    let re: StdOptionItem = {
      icon: getItemIcon(it),
      text: getItemText(it),
      tip: getItemTip(it),
      value: getItemValue(it, index),
    };
    if (it.style) {
      re.style = it.style;
    }
    return re;
  }

  function toStdItems(list: Vars[]): StdOptionItem[] {
    let re = [] as StdOptionItem[];
    for (let i = 0; i < list.length; i++) {
      let li = list[i];
      re.push(toStdItem(li, i));
    }
    return re;
  }

  return {
    // getItemValue,
    // getItemIcon,
    // getItemText,
    // getItemTip,
    toStdItem,
    toStdItems,
  };
}
