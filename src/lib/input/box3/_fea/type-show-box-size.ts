import { LogicType } from "@site0/tijs";

export type ShowBoxSizeProps = {
  maxSize?: number;
  /**
   * 默认为 `tail`
   */
  showSizeAt?: ShowBoxSizeAt;

  /**
   * 默认为 `auto`
   */
  showSizeWhen?: ShowBoxSizeWhen;

  /**
   * 可以指定下面的情况，强制显示
   */
  forceShowSizeWhen?: ForceShowBoxSizeWhen;

  /**
   * 如果 size 没有超（小于 maxSize） 显示的提示样式
   * 默认为 "tip"
   */
  safesizeTipType?: LogicType;

  /**
   * 如果 size 满了（等于 maxSize） 显示的提示样式
   * 默认为 "warn"
   */
  fullsizeTipType?: LogicType;
  /**
   * 如果 size 超过了 maxSize 显示的提示样式
   * 默认为 "danger"
   */
  oversizeTipType?: LogicType;
};

export type ShowBoxSizeWhen =
  | "auto"
  | "focused"
  | "always"
  | "never"
  | "oversize";
export type ForceShowBoxSizeWhen = "none" | "fullsize" | "oversize";

/**
 * 显示框尺寸的位置选项
 *
 * ```
 * [top-left]             [top-right]
 * +--------------------------------+
 * | xxxx                     [tail]|
 * +--------------------------------+
 * [bottom-left]       [bottom-right]
 * ```
 */
export type ShowBoxSizeAt =
  | "tail"
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";
