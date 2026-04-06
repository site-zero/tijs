import {
  AnyOptionItem,
  I18n,
  isAnyOptionItem,
  Match,
  Num,
  Util,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { BoxOptionFilterMaker, useItemLookup } from "../../..";
import {
  BoxOptionsDataProps,
  ValueOptionsSetup,
} from "./types-box-options-data";
//--------------------------------------------------
export type ValueOptions = ReturnType<typeof useBoxOptionsData>;
//--------------------------------------------------
export function useBoxOptionsData(
  props: BoxOptionsDataProps,
  setup: ValueOptionsSetup
) {
  let { dict, getOptionsData, setOptionsData, cookHint } = setup;
  let { optionKeepRaw = false } = props;
  //------------------------------------------------
  function _load_options_data() {
    if (getOptionsData) {
      return getOptionsData() || [];
    }
    return [];
  }
  //------------------------------------------------
  const _options_filter = computed(() => {
    if (props.optionFilter) {
      let flt_vars = props.optionFilterVars ?? {};
      // 如果是函数
      if (_.isFunction(props.optionFilter)) {
        let maker = props.optionFilter as BoxOptionFilterMaker;
        return maker(flt_vars);
      }
      // 否则，就是对象
      let m_input = props.optionFilter;
      if (!_.isEmpty(flt_vars)) {
        m_input = Util.explainObj(flt_vars, props.optionFilter);
      }
      let _mat = Match.parse(m_input, false);
      return (item: Vars) => {
        return _mat.test(item);
      };
    }
    return () => true;
  });
  //------------------------------------------------
  // 计算属性
  //------------------------------------------------
  const FixedOptionsData = computed(() => {
    let list: Vars[] = [];
    if (props.fixedOptions) {
      if (_.isFunction(props.fixedOptions)) {
        list.push(...props.fixedOptions());
      } else {
        list.push(...props.fixedOptions);
      }
    }
    return list;
  });
  //------------------------------------------------
  const OptionsData = computed(() => {
    let list: Vars[] = [];
    // 显示清除选项
    if (props.showCleanOption) {
      list.push({
        icon: props.clearOptionItemIcon,
        text: I18n.text(props.clearOptionItemText ?? "i18n:clear"),
        value: null,
        style: props.clearOptionItemStyle ?? {
          color: "var(--ti-color-secondary)",
        },
      });
    }
    // 添加固定项目
    list.push(...FixedOptionsData.value);
    // 添加动态项目
    let _options_data = _load_options_data();
    for (let it of _options_data) {
      if (_options_filter.value(it)) {
        // 我只是想要一个副本，或许能规避一些潜在的副作用
        list.push(_.cloneDeep(it));
      }
    }
    return list;
  });
  //------------------------------------------------
  const isDataEmpty = computed(() => {
    let _options_data = _load_options_data();
    return _.isEmpty(_options_data);
  });
  //------------------------------------------------
  const isFilteredDataEmpty = computed(() => {
    return _.isEmpty(OptionsData.value);
  });
  //------------------------------------------------
  let lastAbort: AbortController | null = null;
  const ABORT_REASON = "abort-value-options-reload";
  //------------------------------------------------
  function abortOptonsLoading() {
    if (lastAbort) {
      lastAbort.abort({ abort: true, reason: ABORT_REASON });
      lastAbort = null;
    }
  }

  //------------------------------------------------
  function getOptionItemIndex(value: any): number {
    const list = OptionsData.value ?? [];
    if (_.isNil(value) || !list || _.isEmpty(list)) {
      return -1;
    }
    // 逐个寻找选项对象
    let N = list.length;
    for (let i = 0; i < N; i++) {
      let it = list[i];
      let it_val: any;
      if (isAnyOptionItem(it)) {
        it_val = it.value;
      } else {
        it_val = dict.getItemValue(it, i);
      }
      if (value == it_val) {
        return i;
      }
    }

    return -1;
  }
  //------------------------------------------------
  function toOptionItem(it: Vars): AnyOptionItem {
    if (isAnyOptionItem(it)) {
      return it;
    }
    return dict.toStdItem(it).toOptionItem();
  }
  //------------------------------------------------
  function getOptionItemAt(
    index: number,
    offset: number = 0
  ): AnyOptionItem | undefined {
    const list = OptionsData.value ?? [];
    // 防空
    if (index < 0 || !list || index >= list.length) {
      return undefined;
    }

    // 获取对象
    let N = list.length;
    let I = index;
    if (offset != 0) {
      I = Num.scrollIndex(index + offset, N);
    }
    let it = list[I];
    return toOptionItem(it);
  }
  //------------------------------------------------
  function getOptionItem(value: any): AnyOptionItem | undefined {
    if (_.isNil(value) || _.isEmpty(OptionsData.value)) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of OptionsData.value) {
      let stdItem: AnyOptionItem;
      if (isAnyOptionItem(it)) {
        stdItem = it;
      } else {
        stdItem = dict.toStdItem(it).toOptionItem();
      }
      if (value == stdItem.value) {
        return stdItem;
      }
    }
  }
  //------------------------------------------------
  function getRawItem(value: any): Vars | undefined {
    if (_.isNil(value) || _.isEmpty(OptionsData.value)) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of OptionsData.value) {
      let itVal: any;
      if (isAnyOptionItem(it)) {
        itVal = it.value;
      } else {
        itVal = dict.getItemValue(it, -1);
      }
      if (value == itVal) {
        return it;
      }
    }
  }
  //------------------------------------------------
  function lookupOptionItem(hint: string): AnyOptionItem | undefined {
    let _options_data = _load_options_data();
    if (!hint || !_options_data || _.isEmpty(_options_data)) {
      return;
    }
    //
    const _lookup_for_hint = useItemLookup(props);
    // 逐个寻找选项对象
    for (let it of _options_data) {
      if (_lookup_for_hint(it, hint)) {
        return toOptionItem(it);
      }
    }
  }
  //------------------------------------------------
  // 异步方法
  //------------------------------------------------
  async function reloadOptioinsData(hint?: string, whenAbort?: () => void) {
    // 取消重入
    if (lastAbort) {
      lastAbort.abort({ abort: true, reason: ABORT_REASON });
      lastAbort = new AbortController();
    }
    // 准备查询结果列表
    try {
      let re: Vars[];
      // 采用关键词查询
      if (hint || props.forceCookHint) {
        // 预处理搜索条件
        if (cookHint) {
          hint = cookHint(hint ?? "");
        }
        re = await dict.queryData(hint, lastAbort?.signal);
      }
      // 默认全量查询
      else {
        re = await dict.getData(false, lastAbort?.signal);
      }

      // 对值进行过滤
      let _data: Vars[] = [];
      for (let it of re) {
        if (optionKeepRaw) {
          _data.push(it);
        }
        // 转换为标准对象
        else {
          _data.push(dict.toStdItem(it).toOptionItem());
        }
      }

      // 计入返回结果集
      setOptionsData(_data);
    } catch (_e) {
      // 处理错误
      // 对于主动 abort 的操作，忍受异常
      let err = _e as any;
      if (err.abort && err.reason == ABORT_REASON) {
        if (whenAbort) {
          await whenAbort();
        }
        return;
      }
      throw err;
    } finally {
      // 确保收回 abort controller
      lastAbort = null;
    }
  }
  //------------------------------------------------
  async function loadStdItemByValue(
    val: any
  ): Promise<AnyOptionItem | undefined> {
    // 防空
    if (_.isNil(val)) {
      return;
    }
    // 本地有数据
    let re = getOptionItem(val);
    if (re) {
      return re;
    }
    // 尝试远程加载
    let it = await dict.getStdItem(val);
    if (it) {
      return it.toOptionItem();
    }
  }
  //------------------------------------------------
  async function loadRawItemByValue(val: any): Promise<Vars | undefined> {
    // 防空
    if (_.isNil(val)) {
      return;
    }
    // 本地有数据
    let re = getRawItem(val);
    if (re) {
      return re;
    }
    // 尝试远程加载
    let it = await dict.getItem(val);
    if (it) {
      return it;
    }
  }
  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  return {
    OptionsData,
    isDataEmpty,
    isFilteredDataEmpty,
    getOptionItem,
    getOptionItemIndex,
    getOptionItemAt,
    getRawItem,
    toOptionItem,
    lookupOptionItem,
    reloadOptioinsData,
    abortOptonsLoading,
    loadRawItemByValue,
    loadStdItemByValue,
  };
}
