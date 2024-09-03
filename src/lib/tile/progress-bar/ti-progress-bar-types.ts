import { CommonProps, LogicType, Vars } from '../../../_type';

export type ProgressBarTipPosition =
  | 'none'
  | 'head-inner'
  | 'tail-inner'
  | 'head'
  | 'tail'
  | 'center'
  | 'captioin'
  | 'remark';

export type ProgressBarMode = 'H' | 'V';

export type ProgressBarProps = CommonProps & {
  /**
   * 一个在 range 之间的数。
   * 如果超过了 range 边界，则按照边界值计算
   */
  value?: number;

  /**
   * 值表示的范围，默认为 [0,1]
   * 因此也意味着  value 需要是  0-1 的浮点数
   * 表示百分比
   */
  range?: [number, number];

  /**
   * 显示的类型，通常用来表示样式，默认 `info`
   */
  type?: LogicType;

  /**
   * 两种进度条模式:
   *  - `H`: 水平进度条【默认】
   *  - `V`: 垂直进度条
   */
  mode?: ProgressBarMode;

  /**
   * 进度提示信息位置
   *
   * ```
   * # FOR MODE H
   *               <captioin>
   *        +-------------------+-----+
   * <head> ||||||||||<center>|||     | <tail>
   *        +-------------------+-----+
   *                <remark>
   * ```
   * 
   * ```
   * # FOR MODE V
   *                 <head>
   *              +----------+
   *              |=====<head-inner>
   *              |==========|
   *              |==========|
   *              |==========|
   *  <captioin>  |=<center>=| <remark>
   *              |==========|
   *              |----------|
   *              |          |
   *              |     <tail-inner>
   *              +----------+
   *                 <tail>
   * ```
   *
   * 默认为 `center`
   */
  tipAt?: ProgressBarTipPosition;

  //-----------------------------------------------------
  // 自定义样式
  //-----------------------------------------------------
  /*
  +---------------------------------------------------+
  | +---------------------------------+               |
  | |////////^///////////|            |   90%         |
  | +--^-----|------------------------+    ^          |
  +----|-----|-----------------------------|----------+
       |     +-- Indicator                 +-- Tip
       +-- Track
  */
  style?: Vars;
  trackStyle?: Vars;
  indicatorStyle?: Vars;
};
