import { Vars } from "../../../../_type";
import { ItemLookupProps } from "./item-lookup-types";

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
   * 提供固定的选项列表，这些选项会默认的被加入选项列表的前部
   */
  fixedOptions?: Vars[] | (() => Vars[]);

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
