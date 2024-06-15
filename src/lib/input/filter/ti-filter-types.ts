import { GridFieldsInput, OptionsInput, PlaceholderProps } from '../../';
import { ActionBarItem, AppModalProps, CommonProps, StrCaseMode, Vars } from '../../../core';
import { ValueTranslatorProps } from './use-value-translator';

export type FilterValue = Vars;

export type FilterMoreItem = {
  uniqKey: string;
  name: string | string[];
  title: string;
  value: string;
};

export type FilterKeywordMode =
  | 'equal'
  | 'start-with'
  | 'ends-with'
  | 'contains';

export type FilterKeyword = {
  /**
   * 匹配关键字输入，看看是否可以采用本模式的关键字
   */
  test?: any;
  /**
   * 转换匹配条件前，是否先处理一下关键字的形式
   * 譬如在一些忽略大小写的匹配搜索场景下，可能需要将输入
   * 统一转换成大写或者小写
   */
  valueCase?: StrCaseMode;
  /**
   * 将输入的关键字，转换为匹配的条件
   */
  as?: string | Vars | ((s: string) => Vars);

  /**
   * 对于 as:string|string[] 的模式，这里可以指定
   * 具体的匹配模式
   */
  mode?: FilterKeywordMode;
};

type FilterFormProps = Omit<GridFieldsInput, 'data' | 'fields'>;
type MajorFormProps = Omit<
  FilterFormProps,
  | 'data'
  | 'title'
  | 'titleType'
  | 'titleIcon'
  | 'titleStyle'
  | 'titleAlign'
  | 'titleClass'
  | 'tip'
  | 'tipType'
  | 'tipIcon'
  | 'tipStyle'
  | 'tipAlign'
  | 'tipClass'
>;

/**
 * 一个过滤器有下面几个区域
 *
 * ```
 * +-------------------------------+-------------+
 * |          <slot:head>          |             |
 * +...............................+             |
 * |         [K]eywords            | [S]earch    |
 * +-------------------------------+ [R]eset     |
 * |                               | [A]dvance   |
 * |    [M]ajor Filter Fields      | [C]ustomize |
 * |                               | ...         |
 * +-------------------------------+ another     |
 * |    [E]xternal Filter Fields   | actions     |
 * +...............................+             |
 * |          <slot:tail>          |             |
 * +-------------------------------+-------------+
 * ```
 */
export type FilterProps = CommonProps &
  PlaceholderProps &
  ValueTranslatorProps & {
    value?: FilterValue;

    //-----------------------------------------
    // Fields Setup
    //-----------------------------------------
    fields?: GridFieldsInput[];
    majorFields?: string[];
    keywords?: FilterKeyword[];

    //-----------------------------------------
    // Behaviors
    //-----------------------------------------
    canCustomizedMajor?: boolean;
    canOpenAdvanceForm?: 'auto' | 'yes' | 'no';
    moreActions?: ActionBarItem[];

    //-----------------------------------------
    // Major / More
    //-----------------------------------------
    majorForm?: MajorFormProps;

    /**
     * 通常不需要这个字段，有时候不能通过 fields 分析出
     * 一个字段的显示名称，则需要这个属性辅助一下
     */
    fieldTitles?: Record<string, string>;

    //-----------------------------------------
    // Advance
    //-----------------------------------------
    advanceForm?: FilterFormProps;
    advanceModal?: AppModalProps;
  };
