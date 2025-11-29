import { CommonProps, ComRef, DateParseOptionsZone } from "@site0/tijs";

export type TiCalendarEmitter = {
  (event: "change", payload: any): void;
};

export type TiCalendarProps = CommonProps & ComRef & {
  /**
   * 任何可以转换为时间的值
   */
  value?: any;

  /**
   * 输入值的时区
   */
  timezone?: DateParseOptionsZone

  /**
   * 本控件输出的 value 类型
   * 
   * - `date` 日期对象 (new Date())
   * - `str` 字符串 (YYYY-MM-DD)
   * - `ms` 时间戳 (new Date().getTime())
   */
  valueType?: "date" | "str" | "ms"

  /**
   * 指定今日日期，如果未指定，默认采用系统时间作为今日
   */
  today?: any;

  /**
   * 一周开始的日子
   * 0 - 周日 【默认】
   * 1 - 周一
   */
  weekBegin: 0 | 1

  /**
   * 说明显示多少个月的区块。
   * 默认为 1
   */
  size?: number;

  /**
   * 今日区块在区块列表中的位置
   */
  todayIndex?: 0

};
