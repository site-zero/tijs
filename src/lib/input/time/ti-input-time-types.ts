import { CommonProps, TimeInput } from "../../../_type";
import { InputNumProps } from "../num/ti-input-num-types";

export type InputTimeEmitter = {
  (event: "change", payload: TimeInput): void;
};

export type InputTimeMode = "min" | "sec";

export type InputTimeProps = CommonProps & {
  /**
   * 接受的值，譬如:
   * - "12:34:56" : 精确到秒的时间字符串
   * - "12:34" : 精确到分的时间字符串
   * - 45678: 从一天 `00:00:00` 开始的秒数格式, 例如 3688(01:01:28)
   * - {hours: 12, minutes: 34}
   */
  value?: TimeInput;

  /**
   * 传出值的类型：
   *
   * - str: 字符串格式, 例如 "12:34:56"
   * - sec: 秒数格式, 3688(01:01:28)
   * - obj: 对象格式,参见 TimeInfo 定义:
   *
   * ```ts
   * export type TimeInfo = {
   *   hours?: number;
   *   minutes?: number;
   *   seconds?: number;
   *   milliseconds?: number;
   * };
   * ```
   *
   * 默认为 `str`
   */
  valueType?: "str" | "sec" | "obj";

  /**
   * 模式:
   * - min: 分钟模式, 显示格式为 HH:mm
   * - sec: 秒模式, 显示格式为 HH:mm:ss
   * 默认为 `min`
   */
  timeMode?: InputTimeMode;

  /**
   * 是否只读
   */
  readonly?: boolean;

  /**
   * 输入框的配置
   */
  input?: InputNumProps;
};
