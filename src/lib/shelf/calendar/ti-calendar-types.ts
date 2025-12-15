import {
  AspectSize,
  CommonProps,
  ComRef,
  DateParseOptionsZone,
  InputBoxProps,
  LogicType,
  TextFragment,
} from "@site0/tijs";

export type CalendarEmitter = {
  (event: "change", payload: any): void;
};

export type CalendarValueType = "date" | "str" | "ms"

export type CalendarProps = CommonProps &
  ComRef & {
    /**
     * 任何可以转换为时间的值
     */
    value?: any;

    /**
     * 如果值类型是 'str' 输出的格式
     * 默认 `yyyy-MM-dd`
     */
    valueFormat?: string;

    /**
     * 本控件输出的 value 类型
     *
     * - `date` 日期对象 (new Date())
     * - `str` 字符串 (YYYY-MM-DD)
     * - `ms` 时间戳 (new Date().getTime())
     * - `auto` 自动，根据 value 值类型决定，如果 value
     *   为空，则用 `str`
     *
     * 默认为 `auto`
     */
    valueType?: "auto" | CalendarValueType;

    /**
     * 如果输入值为 str 时，指定其时区
     * `null|undefined` 默认采用环境变量指定的时区
     * 
     * @see `datetime.ts#getDefaultTimezoneOffset
     */
    timezone?: DateParseOptionsZone;

    /**
     * 指定今日日期，如果未指定，默认采用系统时间作为今日
     */
    today?: any;

    //-----------------------------------------------------
    // Behavior
    //-----------------------------------------------------
    /**
     * 一周开始的日子
     * 0 - 周日 【默认】
     * 1 - 周一
     */
    weekBegin?: 0 | 1;
    /**
     * 一个月要显示多少周
     * `0` - 自动，一个月有几周就显示几周，因此 4-6 周不等
     * `6` - 固定显示六周【默认】
     *
     * 这个属性，设计是因为：
     * 在视图高度确定的场景下，譬如日期选择时，
     * 如果周行数不同，会让每周行高不断变化，我们更倾向于一个固定的周行高。
     * 在视图高度不固定的场景下，则，我们希望正好显示一个月的日期就好
     */
    weekCount?: 0 | 6;

    /**
     * 在年份下拉表里，要显示今年后几年
     * 比如，今年是 2025年，
     * - `1` 表示你想从 2027年显示
     * - `0` 是默认值，表示从今年显示
     * - `-3` 表示你想从 2022 年显示
     */
    yearDropBegin?: number;

    // /**
    //  * 说明显示多少个月的区块。
    //  * 默认为 1
    //  */
    // size?: number;

    /**
     * 今日区块在区块列表中的位置
     */
    todayIndex?: 0;

    /**
     * 首尾扩展插槽
     */
    head?: TextFragment;
    tail?: TextFragment;

    //-----------------------------------------------------
    // Aspect
    //-----------------------------------------------------
    width?: string;
    height?: string;

    /**
     * 日期格子的圆角
     */
    cellRadius?: AspectSize | string;

    /**
     * 国际化前缀
     *
     * - `dt-w` 显示的是段鸣 (日、一、二、三、四、五、六)
     * - `dt-week` 显示的是完整名称 (星期日、星期一、...、星期六)
     *
     * 默认为  `dt-w
     */
    i18nPrefix?: "dt-w" | "dt-week";

    yearBox?: InputBoxProps;
    monthBox?: InputBoxProps;

    mainPadding?: AspectSize;
    headBg?: LogicType;
    headColor?: LogicType;
    headFontSize?: AspectSize;
    cellBg?: LogicType;
    cellFontSize?: AspectSize;
    cellGap?: AspectSize | string;
    cellTodayBg?: LogicType;
    cellTodayColor?: LogicType;
    cellCurrentBg?: LogicType;
    cellCurrentColor?: LogicType;
  };
