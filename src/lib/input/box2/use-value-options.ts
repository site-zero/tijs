import _ from 'lodash';
import { computed, Ref } from 'vue';
import { Vars } from '../../../_type';
import { Match, TiDict, Util } from '../../../core';
import { ValueHintCooking } from './use-value-hint-cooking';
//--------------------------------------------------
export type ValueOptionsFeature = ReturnType<typeof useValueOptions>;
//--------------------------------------------------
export type OptionFilter = (item: Record<string, any>) => boolean;
export type OptionFilterMaker = (vars: Vars) => OptionFilter;
//--------------------------------------------------
export type ValueOptionsProps = {
  /**
   * 准备好的字典实例
   */
  dict: TiDict;
  /**
   * 要处理的选项数据列表
   */
  _options_data: Ref<Vars[] | undefined>;

  cookHint?: ValueHintCooking;
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

  optionFilterVars?: Vars;

  optionKeepRaw?: boolean;
};
//--------------------------------------------------
export function useValueOptions(props: ValueOptionsProps) {
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
  let lastAbort: AbortController | null = null;
  //------------------------------------------------
  async function reloadOptioinsData(hint?: string) {
    let { dict, cookHint, optionKeepRaw=false } = props;
    // 取消重入
    if (lastAbort) {
      lastAbort.abort();
      lastAbort = new AbortController();
    }
    // 准备查询结果列表
    let re: Vars[];
    // 采用关键词查询
    if (hint) {
      // 预处理搜索条件
      if (cookHint) {
        hint = cookHint(hint);
      }
      re = await dict.queryData(hint, lastAbort?.signal);
    }
    // 默认全量查询
    else {
      re = await dict.getData();
    }

    // 对值进行过滤
    let _data: Vars[] = [];
    for (let it of re) {
      if (_options_filter.value(it)) {
        if (!optionKeepRaw) {
        }
      }
    }
  }
  //------------------------------------------------
}
