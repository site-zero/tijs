import {
  BoxOptionFilterMaker,
  getBoxOptionItemHint,
  I18n,
  IconInput,
  ItemLookupProps,
  Match,
  setBoxOptionItemHint,
  useItemLookup,
  Util,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";

export type OptionsFilterProps = ItemLookupProps & {
  /**
   * 提供固定的选项列表，这些选项会默认的被加入选项列表的前部
   */
  fixedOptions?: Vars[] | (() => Vars[]);

  /**
   * 一个过滤器 AutoMatch，用来预先过滤字典项
   * 第二个参数是解析上下文，来自 box 的 vars 字段
   * 如果控件在表单里，自然采用表单字段的动态上下文
   *
   * 如果指定 `lookup` 那么需要控件的 lookup 属性来支撑
   *
   */
  optionFilter?:
    | Record<string, any>
    | Record<string, any>[]
    | BoxOptionFilterMaker
    | "lookup";

  /**
   * 生成 optionFilter 的上下文，
   * - 如果 optionFilter 是对象，那么就是 explain 的上下文
   * - 如果是 OptionFilterMaker，那么就是函数的参数
   */
  optionFilterVars?: Vars;

  /**
   * 是否要在选项的首部，增加一个【清除】 的选项
   */
  showCleanOption?: boolean;

  /**
   * 如果 showCleanOption 为 true，
   * 可以用这个选项指定清除项目图标
   * `null` 表示不显示图标
   *
   * 默认显示 `zmdi-delete`
   */
  clearOptionItemIcon?: IconInput | null;
  /**
   * 如果 showCleanOption 为 true，
   * 可以用这个选项指定清除项目文字，支持 `i18n` 的写法
   * 默认为 `i18n:clear`
   */
  clearOptionItemText?: string;
  /**
   * 如果 showCleanOption 为 true，
   * 可以用这个选项指定清除项目样式
   */
  clearOptionItemStyle?: Vars;
};

export type OptionsFilterSetup = {
  getHint?: () => string;
};

export function useOptionsFilter(
  props: OptionsFilterProps,
  setup: OptionsFilterSetup
) {
  const { getHint } = setup;
  //------------------------------------------------
  // 计算属性
  //------------------------------------------------
  function createFilter() {
    if (props.optionFilter) {
      let flt_vars = props.optionFilterVars ?? {};
      // 如果是函数
      if (_.isFunction(props.optionFilter)) {
        let maker = props.optionFilter as BoxOptionFilterMaker;
        return maker(flt_vars);
      }
      // 指定是 lookup，那么就得有 lookup 属性
      // 否则就是默认 true
      if ("lookup" == props.optionFilter) {
        if (props.lookup) {
          const itLookup = useItemLookup(props);
          return (item: Vars) => {
            let hint = getBoxOptionItemHint(item);
            let re = itLookup.matchAny(item, hint);
            return re;
          };
        }
        // 未指定 lookup 属性，直接返回 true
        return () => true;
      }

      // 剩下的情况就是把 optionFilter 当做 Matche 对象好了
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
  }
  //------------------------------------------------
  const _options_filter = computed(() => createFilter());
  //------------------------------------------------
  // 处理函数
  //------------------------------------------------
  function getFixedOptions(): Vars[] {
    let list: Vars[] = [];
    if (props.fixedOptions) {
      if (_.isFunction(props.fixedOptions)) {
        list.push(...props.fixedOptions());
      } else {
        list.push(...props.fixedOptions);
      }
    }
    return list;
  }
  //------------------------------------------------
  function filterOptionsData(list: Vars[]) {
    let re: Vars[] = [];
    // 显示清除选项
    if (props.showCleanOption) {
      re.push({
        icon: props.clearOptionItemIcon,
        text: I18n.text(props.clearOptionItemText ?? "i18n:clear"),
        value: null,
        style: props.clearOptionItemStyle ?? {
          color: "var(--ti-color-secondary)",
        },
      });
    }
    // 添加固定项目
    re.push(...getFixedOptions());
    // 添加动态项目
    let is_match_option_filter = _options_filter.value;
    let hint = getHint ? getHint() : "";
    for (let it of list) {
      let itVars = setBoxOptionItemHint(it, hint);
      // 建立动态项目
      if (is_match_option_filter(itVars)) {
        // 我只是想要一个副本，或许能规避一些潜在的副作用
        re.push({ ...it });
      }
    }
    return re;
  }
  //------------------------------------------------
  // 返回接口
  //------------------------------------------------
  return {
    getFixedOptions,
    createFilter,
    filterOptionsData,
  };
}
