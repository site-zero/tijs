import { CommonProps, InputBoxProps } from "@site0/tijs";

export type InputMultiLinesValue = string | string[];

export type TiInputMultiLinesEmitter = {
  (event: "change", payload: InputMultiLinesValue | null): void;
};

export type TiInputMultiLinesProps = CommonProps & {
  /**
   * 输入的数值
   */
  value?: InputMultiLinesValue;

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
   * 每行的输入框具体定制配置
   */
  inputConfig?: Omit<InputBoxProps, "value">;
};
