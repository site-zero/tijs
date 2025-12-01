import { CommonProps, ComRef, DateParseOptionsZone, TextFragment } from "@site0/tijs";

export type CalendarEmitter = {
  (event: "change", payload: any): void;
};

export type CalendarProps = CommonProps & ComRef & {
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
   * 国际化前缀
   * 
   * - `dt-w` 显示的是段鸣 (日、一、二、三、四、五、六)
   * - `dt-week` 显示的是完整名称 (星期日、星期一、...、星期六)
   * 
   * 默认为  `dt-w
   */
  i18nPrefix?: 'dt-w' | 'dt-week';

  /**
   * 一周开始的日子
   * 0 - 周日 【默认】
   * 1 - 周一
   */
  weekBegin?: 0 | 1

  /**
   * 说明显示多少个月的区块。
   * 默认为 1
   */
  size?: number;

  /**
   * 今日区块在区块列表中的位置
   */
  todayIndex?: 0

  /**
   * 首尾扩展插槽
   */
  head?: TextFragment;
  tail?: TextFragment;

  width?: string;
  height?: string;

};
