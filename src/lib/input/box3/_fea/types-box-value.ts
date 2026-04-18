import { Callback1 } from "@site0/tijs";

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
  /**
   * 抛开事件机制不谈，我们有时候总归是需要这样一个回调的
   */
  onValueChange?: Callback1<any>;
};
