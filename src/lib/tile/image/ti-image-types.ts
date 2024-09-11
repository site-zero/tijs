import { CommonProps, CssObjectFit, IconObj, Vars } from '../../../_type';

export type ImageSrcInput = string | File | IconObj;

export type ImageProps = CommonProps & {
  /**
   * 图像的源，直接在<img>里使用
   */
  src?: ImageSrcInput;

  /**
   * 未指定 src 时，显示什么
   */
  dftSrc?: string | IconObj;

  width?: number | string;
  height?: number | string;
  objectFit?: CssObjectFit;

  style?: Vars;
  imgStyle?: Vars;
};
