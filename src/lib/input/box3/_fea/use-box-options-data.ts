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
  BoxOptionsDataSetup,
} from "./types-box-options-data";
//--------------------------------------------------
const debug = false;
//--------------------------------------------------
export type ValueOptions = ReturnType<typeof useBoxOptionsData>;
//--------------------------------------------------
export function useBoxOptionsData(
  props: BoxOptionsDataProps,
  setup: BoxOptionsDataSetup
) {
  const { dict, cookHint } = setup;
  const { optionKeepRaw = false } = props;
  //------------------------------------------------
  // 动态过滤器
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
  // 数据计算
  //------------------------------------------------
  function filterOptionsData(_options_data: Vars[]) {
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
    for (let it of _options_data) {
      if (_options_filter.value(it)) {
        // 我只是想要一个副本，或许能规避一些潜在的副作用
        list.push(_.cloneDeep(it));
      }
    }
    return list;
  }
  //------------------------------------------------
  let lastAbort: AbortController | null = null;
  const ABORT_REASON = "abort-value-options-reload";
  //------------------------------------------------
  // 帮助函数
  //------------------------------------------------
  function toOptionItem(it: Vars): AnyOptionItem {
    if (isAnyOptionItem(it)) {
      return it;
    }
    return dict.toStdItem(it).toOptionItem();
  }
  //------------------------------------------------
  function getOptionItemIndex(list: Vars[], value: any): number {
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
        itVal = dict.getItemValue(it, -1);
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
  ): Vars | undefined {
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
  ): AnyOptionItem | undefined {
    if (_.isNil(value) || _.isEmpty(list)) {
      return;
    }
    // 逐个寻找选项对象
    for (let it of list) {
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
  function lookupItem(list: Vars[], hint: string): Vars | undefined {
    if (!hint || !list || _.isEmpty(list)) {
      return;
    }
    //
    const _lookup_for_hint = useItemLookup(props);
    // 逐个寻找选项对象
    for (let it of list) {
      if (_lookup_for_hint(it, hint)) {
        return it;
      }
    }
  }
  //------------------------------------------------
  // 异步方法
  //------------------------------------------------
  function abortOptonsLoading() {
    if (lastAbort) {
      lastAbort.abort({ abort: true, reason: ABORT_REASON });
      lastAbort = null;
    }
  }
  //------------------------------------------------
  async function reloadOptioinsData(
    hint?: string,
    whenAbort?: () => void
  ): Promise<Vars[]> {
    // 取消重入
    if (lastAbort) {
      lastAbort.abort({ abort: true, reason: ABORT_REASON });
      lastAbort = new AbortController();
    }
    if (debug) console.log("reloadOptioinsData: hint=", hint);
    // 准备查询结果列表
    try {
      let re: Vars[];
      // 采用关键词查询
      if (props.tipUseHint && (hint || props.forceCookHint)) {
        let cooked_hint = hint;
        // 预处理搜索条件
        if (cookHint) {
          cooked_hint = cookHint(hint ?? "");
        }
        re = await dict.queryData(cooked_hint, lastAbort?.signal);
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
      return _data;
    } catch (_e) {
      // 处理错误
      // 对于主动 abort 的操作，忍受异常
      let err = _e as any;
      if (err.abort && err.reason == ABORT_REASON) {
        if (whenAbort) {
          await whenAbort();
        }
        return [];
      }
      throw err;
    } finally {
      // 确保收回 abort controller
      lastAbort = null;
    }
  }
  //------------------------------------------------
  async function loadStdItemByValue(
    list: Vars[],
    val: any
  ): Promise<AnyOptionItem | undefined> {
    // 防空
    if (_.isNil(val)) {
      return;
    }
    // 本地有数据
    let re = getOptionItemByVal(list, val);
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
  async function loadRawItemByValue(
    list: Vars[],
    val: any
  ): Promise<Vars | undefined> {
    // 防空
    if (_.isNil(val)) {
      return;
    }
    // 本地有数据
    let re = getRawItemByVal(list, val);
    if (re) {
      return re;
    }
    // 尝试远程加载
    let it = await dict.getItem(val);
    if (debug) console.log(`loadRawItemByValue: val=${val} : it=`, it);
    if (it) {
      return _.cloneDeep(it);
    }
  }
  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  return {
    // 计算属性
    FixedOptionsData,

    // 数据计算
    filterOptionsData,

    // 帮助函数
    toOptionItem,
    getOptionItemIndex,
    getRawItemAt,
    getRawItemByVal,
    getOptionItemAt,
    getOptionItemByVal,
    lookupItem,

    // 异步方法
    abortOptonsLoading,
    reloadOptioinsData,
    loadRawItemByValue,
    loadStdItemByValue,
  };
}
