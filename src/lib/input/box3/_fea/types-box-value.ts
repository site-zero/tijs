export type BoxValueType = "raw-item" | "std-item" | "val";

export type BoxValueProps = {
  /**
   * 输入值
   */
  value?: any;

  /**
   * 输入框的值类型
   *
   * - `raw-item`: 选项的原生对象
   * - `std-item`: 选项的标准对象
   * - `val` : 「默认」值
   */
  valueType?: BoxValueType;
};
