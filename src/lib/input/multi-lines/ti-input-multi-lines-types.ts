import { CommonProps, InputBoxProps, ReadonlyProps } from "@site0/tijs";

export type TiInputMultiLinesEmitter = {
  (event: "change", payload: any): void;
};

export type TiInputMultiLinesProps = CommonProps & {
  /**
   * 输入的数值
   */
  value?: string | string[];

  /**
   * 如何将值转换为字符串数组
   * - `string` : 拆分字符的分隔符
   * - `RegExp` : 正则表达式，拆分字符串
   * - `Function` : 自定义方式
   */
  format?: string | RegExp | ((input: string | string[]) => string[]);

  /**
   * 是否只读
   */
  readonly?: boolean;

  /**
   * 每行的输入框具体定制配置
   */
  inputConfig?: Omit<InputBoxProps, "value">;
};
