import {
  Convertor,
  IconInput,
  isAnyOptionItem,
  ItemLookupProps,
  Num,
  OptionItem,
  useItemLookup,
  Util,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";

export type OptionItemProps<T> = ItemLookupProps & {
  showCleanOption?: boolean;
  getIcon?: string | Convertor<Vars, IconInput | undefined>;
  getText?: string | Convertor<Vars, string | undefined>;
  getTip?: string | Convertor<Vars, string | undefined>;
  getValue?: string | Convertor<Vars, T>;
};

export function useOptionItem<T>(props: OptionItemProps<T>) {
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const _get_icon = computed(() => Util.genGetter(props.getIcon));
  const _get_text = computed(() => Util.genGetter(props.getText));
  const _get_tip = computed(() => Util.genGetter(props.getTip));
  //-----------------------------------------------------
  const _get_value = computed(() => {
    if (!props.getValue) {
      return (vars: Vars) => {
        let re = Util.fallback(vars.value, vars.id, vars.uniqKey, vars.key);
        return re as T;
      };
    }
    return Util.genGetterWithDft<T>(props.getValue, {
      getDefault: () => {
        throw "Fail to get Value and I can not specify a default!";
      },
    });
  });
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function getIcon(vars: Vars): IconInput | undefined {
    return _get_icon.value(vars);
  }
  //-----------------------------------------------------
  function getText(vars: Vars): string | undefined {
    return _get_text.value(vars);
  }
  //-----------------------------------------------------
  function getTip(vars: Vars): string | undefined {
    return _get_tip.value(vars);
  }
  //-----------------------------------------------------
  function getValue(vars: Vars): T {
    return _get_value.value(vars);
  }
  //-----------------------------------------------------
  function toOptionItem(vars: Vars): OptionItem<T> {
    return {
      icon: getIcon(vars),
      text: getText(vars),
      tip: getTip(vars),
      value: getValue(vars),
    };
  }
  //------------------------------------------------
  function getOptionItemIndex(list: Vars[], value: any): number {
    const dft_re = props.showCleanOption ? 0 : -1;
    if (_.isNil(value) || !list || _.isEmpty(list)) {
      return dft_re;
    }
    // 逐个寻找选项对象
    let N = list.length;
    for (let i = 0; i < N; i++) {
      // 跳过清除选项
      if (i == 0 && props.showCleanOption) {
        continue;
      }
      let it = list[i];
      let it_val: any;
      if (isAnyOptionItem(it)) {
        it_val = it.value;
      } else {
        it_val = getValue(it);
      }
      if (value == it_val) {
        return i;
      }
    }

    return dft_re;
  }
  //------------------------------------------------
  function getRawItemAt(
    list: Vars[],
    index: number,
    offset: number = 0
  ): Vars | undefined {
    // 防空
    if (!list || _.isEmpty(list)) {
      return undefined;
    }

    // 准备返回值
    let N = list.length;
    let I = index;

    // Index 区域外
    if (I < 0 || I >= list.length) {
      if (offset < 0) {
        I = Num.scrollIndex(offset, N);
      } else {
        I = 0;
      }
    }
    // 获取对象
    else if (offset != 0) {
      I = Num.scrollIndex(index + offset, N);
    }
    let it: Vars | undefined = list[I];
    return it;
  }
  //------------------------------------------------
  function getRawItemByVal(list: Vars[], value: any): Vars | undefined {
    if (_.isNil(value) || _.isEmpty(list)) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of list) {
      let itVal: any;
      if (isAnyOptionItem(it)) {
        itVal = it.value;
      } else {
        itVal = getValue(it);
      }
      if (value == itVal) {
        return it;
      }
    }
  }
  //------------------------------------------------
  function getOptionItemAt(
    list: Vars[],
    index: number,
    offset: number = 0
  ): OptionItem<T> | undefined {
    const it = getRawItemAt(list, index, offset);
    if (it) {
      return toOptionItem(it);
    }
    return undefined;
  }
  //------------------------------------------------
  function getOptionItemByVal(
    list: Vars[],
    value: any
  ): OptionItem<T> | undefined {
    if (_.isNil(value) || _.isEmpty(list)) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of list) {
      let stdItem: OptionItem<T>;
      if (isAnyOptionItem(it)) {
        stdItem = it;
      } else {
        stdItem = toOptionItem(it);
      }
      if (value == stdItem.value) {
        return stdItem;
      }
    }
  }
  //------------------------------------------------
  function lookupItem(list: Vars[], hint: string): Vars | undefined {
    if (!hint || !list || _.isEmpty(list)) {
      return;
    }
    const itLookup = useItemLookup(props);
    const matchers = itLookup.matchers;
    // 逐个 matcher 寻找
    for (let is_match of matchers) {
      // 逐个寻找选项对象
      for (let it of list) {
        if (is_match(it, hint)) {
          return it;
        }
      }
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    getIcon,
    getText,
    getTip,
    getValue,
    toOptionItem,
    getOptionItemIndex,
    getRawItemAt,
    getRawItemByVal,
    getOptionItemAt,
    getOptionItemByVal,
    lookupItem,
  };
}
