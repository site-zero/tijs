import {
  DictProps,
  DisplayTextProps,
  PlaceholderProps,
  ValuePipeProps,
} from "../../";
import {
  AspectSize,
  BoxColorMode,
  CommonProps,
  CssAlignment,
  IconInput,
  LogicType,
  Vars,
} from "../../../_type";
import { ClickCopyProps } from "./use-click-copy";
import { useLabel } from "./use-label";

export type LabelEmitter = {
  (eventName: "change", payload: any): void;
  (eventName: "click-prefix-icon", api: LabelApi): void;
  (eventName: "click-suffix-icon", api: LabelApi): void;
};

export type LabelApi = ReturnType<typeof useLabel>;

export type LabelState = {
  text?: string;
  icon?: IconInput;
  tip?: string;
};

export type LabelIconFor =
  | "clear"
  | "copy"
  | "copy-raw"
  | "click"
  | ((label: LabelApi) => void);

export type LabelAspectProps = {
  boxFontSize?: AspectSize;
  boxPadding?: AspectSize;
  boxRadius?: AspectSize | "none";
  showBorder?: boolean;
  align?: CssAlignment;
  type?: LogicType;
  /**
   * 如果通过 type 来指定控件的颜色，有时候，我们希望
   * 整体背景是主颜色，这时候可以设置 colorMode 为 'box'
   *
   * 默认的，我们使用 'text
   */
  colorMode?: BoxColorMode;
  width?: string;
  valuePartStyle?: Vars;
};

export type LabelProps = CommonProps &
  LabelAspectProps &
  PlaceholderProps &
  ValuePipeProps &
  DictProps &
  DisplayTextProps &
  ClickCopyProps & {
    value?: any;

    /**
     * 检查当前的输入是否是有效输入，
     * 默认的，如果 "" 或者 null/undefined 均算无效输入。
     * 如果指定了这个函数，那么就会调用这个函数来检查输入是否有效。
     * 它会影响 TopClass 里的 `has-value/nil-value` 类选择器。
     * 从而导致控件外观的不同（采用 Placeholder 加灰显示）
     *
     * @param val 输入的属性值
     * @returns 当前的输入是否是有效输入
     */
    hasValue?: (val: any) => boolean;

    tip?: string;

    /**
     * 指定超链接
     */
    href?: string | ((ctx: Vars) => string);

    /**
     * 指定渲染超链接的上下文，其中value键会被控件 value 取代。
     * 因此你设置了也没用。
     */
    vars?: Vars;

    /**
     * 指定是否捕获点击，设置为 true 会导致事件不会冒泡到父组件
     */
    captureClick?: boolean;
    clickable?: boolean;
    nowrap?: boolean;
    disable?: boolean;

    /**
     * 如果开启这个开关, 只要定义了字典，且 mustInOptions
     * 那么将自动根据选项设置前缀图标
     */
    autoPrefixIcon?: boolean;

    /**
     * 前缀图标
     */
    prefixIcon?: IconInput | null;
    prefixHoverIcon?: IconInput | null;
    /**
     * 声明了这个动作，则表示这个图标可以点击
     */
    prefixIconFor?: LabelIconFor;

    /**
     * 后缀图标
     */
    suffixIcon?: IconInput | null;
    suffixHoverIcon?: IconInput | null;
    /**
     * 声明了这个动作，则表示这个图标可以点击
     */
    suffixIconFor?: LabelIconFor;
  };
