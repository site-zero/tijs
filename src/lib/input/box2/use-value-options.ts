import _ from "lodash";
import { computed, Ref } from "vue";
import { AnyOptionItem, isAnyOptionItem, Vars } from "../../../_type";
import { Match, Num, TiDict, Util } from "../../../core";
import { ItemLookupProps, useItemLookup } from "./use-item-lookup";
import { ValueHintCooking } from "./use-value-hint-cooking";
//--------------------------------------------------
export type ValueOptions = ReturnType<typeof useValueOptions>;
//--------------------------------------------------
export type OptionFilter = (item: Record<string, any>) => boolean;
export type OptionFilterMaker = (vars: Vars) => OptionFilter;
//--------------------------------------------------
export type ValueOptionsProps = ItemLookupProps & {
  /**
   * 值必须在字典中
   */
  mustInOptions?: boolean;
  /**
   * 一个过滤器 AutoMatch，用来预先过滤字典项
   * 第二个参数是解析上下文，来自 box 的 vars 字段
   * 如果控件在表单里，自然采用表单字段的动态上下文
   */
  optionFilter?:
    | Record<string, any>
    | Record<string, any>[]
    | OptionFilterMaker;

  /**
   * 生成 optionFilter 的上下文，
   * - 如果 optionFilter 是对象，那么就是 explain 的上下文
   * - 如果是 OptionFilterMaker，那么就是函数的参数
   */
  optionFilterVars?: Vars;
  /**
   * 获取的的 option 结果集，采用原生数据还是转换为标准数据
   */
  optionKeepRaw?: boolean;

  /**
   * 开启了这个选项，在 reloadOptionsData 时，无论 hint 是否为空
   * 都强制采用 dict.queryData 进行查询
   *
   * 涉及的主要场景，是查询 state 时候，服务器可能需要 cookHint
   * 的结果带上国家代码，而不是单纯的关键词
   */
  forceCookHint?: boolean;
};
//--------------------------------------------------
export type ValueOptionsInput = {
  /**
   * 准备好的字典实例
   */
  dict: TiDict;
  /**
   * 要处理的选项数据列表
   */
  _options_data: Ref<Vars[] | undefined>;

  /**
   * 对于搜索提示信息进行预处理
   */
  cookHint?: ValueHintCooking;
};
//--------------------------------------------------
export function useValueOptions(
  input: ValueOptionsInput,
  props: ValueOptionsProps
) {
  let { dict, _options_data, cookHint } = input;
  let { optionKeepRaw = false } = props;
  //------------------------------------------------
  const _lookup_for_hint = computed(() => useItemLookup(props));
  //------------------------------------------------
  const _options_filter = computed(() => {
    if (props.optionFilter) {
      let flt_vars = props.optionFilterVars ?? {};
      // 如果是函数
      if (_.isFunction(props.optionFilter)) {
        let maker = props.optionFilter as OptionFilterMaker;
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
  const OptionsData = computed(() => {
    let list: Vars[] = [];
    for (let it of _options_data.value ?? []) {
      if (_options_filter.value(it)) {
        // 我只是想要一个副本，或许能规避一些潜在的副作用
        list.push(_.cloneDeep(it));
      }
    }
    return list;
  });
  //------------------------------------------------
  const isDataEmpty = computed(() => {
    return _.isEmpty(_options_data.value);
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
      _options_data.value = _data;
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
    if (
      _.isNil(value) ||
      !_options_data.value ||
      _.isEmpty(_options_data.value)
    ) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of _options_data.value) {
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
    if (
      _.isNil(value) ||
      !_options_data.value ||
      _.isEmpty(_options_data.value)
    ) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of _options_data.value) {
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
    if (!hint || !_options_data.value || _.isEmpty(_options_data.value)) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of _options_data.value) {
      if (_lookup_for_hint.value(it, hint)) {
        return toOptionItem(it);
      }
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
  };
}
