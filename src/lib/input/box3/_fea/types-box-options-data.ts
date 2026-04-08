import { IconInput, TiDict, Vars } from "@site0/tijs";
import { BoxHintCooking } from "./fea-box-hint-cooking";
import { ItemLookupProps } from "./types-item-lookup";

//--------------------------------------------------
export type BoxOptionFilter = (item: Record<string, any>) => boolean;
export type BoxOptionFilterMaker = (vars: Vars) => BoxOptionFilter;
//--------------------------------------------------
export type BoxOptionsDataProps = ItemLookupProps & {
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
    | BoxOptionFilterMaker;

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

  /**
   *  查询提示信息的时候，采用输入的值
   * 默认 false
   */
  tipUseHint?: boolean;

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

//--------------------------------------------------
export type BoxOptionsDataSetup = {
  /**
   * 准备好的字典实例
   */
  dict: TiDict;
  /**
   * 要处理的选项数据列表
   */
  // getOptionsData?: () => Vars[] | undefined;
  // setOptionsData: (data: Vars[]) => void;

  /**
   * 对于搜索提示信息进行预处理
   */
  cookHint?: BoxHintCooking;
};
