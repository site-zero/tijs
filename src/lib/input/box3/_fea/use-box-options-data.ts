import {
  AnyOptionItem,
  useOptionItem,
  useOptionsFilter,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import {
  BoxOptionsDataProps,
  BoxOptionsDataSetup,
} from "./types-box-options-data";
//--------------------------------------------------
const debug = false;
//--------------------------------------------------
export type BoxOptionsDataApi = ReturnType<typeof useBoxOptionsData>;
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
  const _oflt = useOptionsFilter(props);
  const _item = useOptionItem<any>(props);
  //------------------------------------------------
  // 计算属性
  //------------------------------------------------
  function filterOptionsData(list: Vars[]) {
    return _oflt.filterOptionsData(list);
  }
  //------------------------------------------------
  let lastAbort: AbortController | null = null;
  const ABORT_REASON = "abort-value-options-reload";
  //------------------------------------------------
  // 帮助函数
  //------------------------------------------------
  function toOptionItem(it: Vars): AnyOptionItem {
    return _item.toOptionItem(it);
  }
  //------------------------------------------------
  function getOptionItemIndex(list: Vars[], value: any): number {
    return _item.getOptionItemIndex(list, value);
  }
  //------------------------------------------------
  function getRawItemAt(
    list: Vars[],
    index: number,
    offset: number = 0
  ): Vars | undefined {
    return _item.getRawItemAt(list, index, offset);
  }
  //------------------------------------------------
  function getRawItemByVal(list: Vars[], value: any): Vars | undefined {
    return _item.getRawItemByVal(list, value);
  }
  //------------------------------------------------
  function getOptionItemAt(
    list: Vars[],
    index: number,
    offset: number = 0
  ): AnyOptionItem | undefined {
    return _item.getOptionItemAt(list, index, offset);
  }
  //------------------------------------------------
  function getOptionItemByVal(
    list: Vars[],
    value: any
  ): AnyOptionItem | undefined {
    return _item.getOptionItemByVal(list, value);
  }
  //------------------------------------------------
  function lookupItem(list: Vars[], hint: string): Vars | undefined {
    return _item.lookupItem(list, hint);
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

      // 对值进行处理
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
