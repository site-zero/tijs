import {
  AspectSize,
  CommonProps,
  CssAlignment,
  LogicType,
  Vars,
} from "@site0/tijs";

export type BoxAspectProps = CommonProps & {
  /**
   * 隐藏输入框边框
   */
  hideBorder?: boolean;

  style?: Vars;
  inputStyle?: Vars;
  partMainStyle?: Vars;
  mainBodyStyle?: Vars;
  align?: CssAlignment;
  boxFontSize?: AspectSize;
  boxPadding?: AspectSize;
  boxRadius?: AspectSize | "none";
  type?: LogicType;
  width?: string;
  /**
   * 自动适配父元素的宽（如果父元素是 flex 布局的话）
   */
  flexAuto?: boolean;

  /**
   * 展出提示框最小宽度，如果不声明，则采用与 box 相同的宽度
   */
  tipListWidth?: string;

  /**
   * 展出提示框最小宽度，如果不声明，则采用与 box 相同的宽度
   */
  tipListMinWidth?: string;
};
