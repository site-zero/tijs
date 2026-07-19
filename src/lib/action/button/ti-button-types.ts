import {
  AspectSize,
  BoxColorMode,
  CommonProps,
  CssAlignment,
  IconInput,
  LogicType,
} from '../../../_type';

export type ButtonEmitter = {
  (event: 'click', payload: any): void;
}

export type ButtonProps = CommonProps & {
  icon?: IconInput;
  text?: string;
  autoI18n?: boolean;

  // 默认的 Button Click 时的 payload
  value?: any;
  stopPropagation?: boolean;
  // 声明了这个回调，将不会触发 emit，
  action?: (payload: any) => void;

  // 外观
  boxFontSize?: AspectSize;
  boxPadding?: AspectSize;
  boxRadius?: AspectSize | 'none';
  showBorder?: boolean | string | number;
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
  minWidth?: string;
};
