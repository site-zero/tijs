import {
  InputBoxProps,
  InputNumProps,
  InputTimeMode,
  PlaceholderProps,
  ReadonlyProps,
} from "@site0/tijs";
import {
  CommonProps,
  DateParseOptionsZone,
  DateTimeQuickParseMode,
} from "../../../_type";

export type InputDateTimeEmitter = {
  (event: "change", payload: string | number | null): void;
};

export type InputDatetimeProps = CommonProps &
  ReadonlyProps &
  PlaceholderProps &
  Pick<
    InputBoxProps,
    "prefixIcon" | "prefixHoverIcon" | "suffixIcon" | "suffixHoverIcon"
  > & {
    value?: number | Date | string;

    /**
     * - string 用字符串格式
     * - timestamp 直接存储时间戳
     */
    valueType?: "string" | "timestamp";
    /**
     * 如果指定了 valueType==string，那么具体用什么格式存储
     * 默认为 yyyy-MM-dd HH:mm:ss
     */
    valueFormat?: string;

    /**
     * 自动选择
     */
    autoSelect?: boolean;

    // 前缀按钮用来删除
    prefixIconForClean?: boolean;

    // 显示的格式化方式格式化
    format?: string;

    /**
     * 快速输入模式
     *
     * @see ti-datetime.ts#quickParse
     */
    quickInputMode?: DateTimeQuickParseMode;

    /**
     * 本控件的所在时区（即，显示的时区）
     * 如果未指定则采用系统上下文里默认时区
     */
    timezone?: DateParseOptionsZone;

    /**
     * 特别指定输入值（当字符串时）的时区
     * 如果没有指定这个属性，则采用 timezone 属性的值
     */
    valueTimezone?: DateParseOptionsZone;

    /**
     * 时间输入框的模式
     * @see TiInputTime
     */
    timeMode?: InputTimeMode;

    /**
     * 时间输入框的配置
     */
    timeInput?: InputNumProps;
  };
