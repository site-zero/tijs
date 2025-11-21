import {
  ActionBarProps,
  CommonProps,
  InputBoxProps,
  LogicType,
  RoadblockProps,
} from "@site0/tijs";

export type InputMultiLinesValue = string | string[];

export type InputMultiLinesEmitter = {
  (event: "change", payload: InputMultiLinesValue | null): void;
};

export type InputMultiLinesProps = CommonProps & {
  /**
   * 输入的数值
   */
  value?: InputMultiLinesValue;

  /**
   * 添加新值，采用的什么默认字符串
   * // 默认为空字符串
   */
  newItem?: string;

  /**
   * 如果没有值，是否是需要转换为 null
   */
  emptyAsNull?: boolean;

  /**
   * 如果为 true ，则每次改动时，都会将空字符去掉
   */
  autoFilterNilItem?: boolean;

  /**
   * 如何将值转换为字符串数组
   * - `string` : 拆分字符的分隔符
   * - `RegExp` : 正则表达式，拆分字符串
   * - `Function` : 自定义方式
   */
  splitValue?: string | RegExp | ((input: string | string[]) => string[]);

  /**
   * 如何将值转换为输入的值，以便通知改动
   * - `string` : 指定一个分隔符，则用其来拼合为一个字符串
   * - `Function` : 自定义转换为字符串数组或字符串方式
   * 默认的，则看输入 value 的类型
   */
  joinValue?: string | ((input: string[]) => string | string[]);

  /**
   * 是否只读
   */
  readonly?: boolean;

  /**
   * 空白数据，显示的样式
   */
  emptyRoadblock?: RoadblockProps;

  /**
   * 选中项的样式,默认为 primary
   */
  checkedItemType?: LogicType;
  /**
   * 空项的样式,默认为 undefined
   */
  emptyItemType?: LogicType;
  /**
   * 选中空项的样式,默认为 跟随 checkedItemType
   */
  checkedEmptyItemType?: LogicType;

  /**
   * 每行的输入框具体定制配置
   */
  inputConfig?: Omit<InputBoxProps, "value">;

  /**
   * 动作条配置
   */
  actionBar?: ActionBarProps;
};
