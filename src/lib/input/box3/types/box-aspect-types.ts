import { AspectSize, CssAlignment, LogicType, Vars } from "../../../../_type";

//--------------------------------------------------
export type InputBoxAspect = {
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
};