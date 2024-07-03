import { CssGridLayout } from './core-type-css';

/**
 * 根据当前的视口宽度，得到轨道数量
 */
export type GridLayoutTrackGetter = (width: number) => number;

export type GridLayoutTrackSizeGetter = (
  trackIndex: number,
  trackCount: number
) => string;

export type GridLayoutTrackSizeCustomizedGetter = (
  trackIndex: number,
  trackCount: number,
  dftGetter: GridLayoutTrackSizeGetter
) => string;

/**
 * 描述了一个条件: [3, 500] 相当于尺寸大于500，就是 3
 *
 * 如果就是一个数字，则表示固定的结果
 */
export type GridLayoutHintItem = number | [number, number];

/**
 * 可以支持三种形式的值来描述一个维度的轨道布局
 *
 * ### String
 *
 * 如果传入的是字符串，则必须可以被 JSON 解析为 GridHintItem[]
 * 否则会发生不可预知的错误
 *
 * ### Number
 *
 * 指定了轨道数量
 *
 * ### `AutoGridHintItem[]`
 *
 * 根据本维度尺寸自动计算
 *
 */
export type GridLayoutHint = string | number | GridLayoutHintItem[];

export type GridLayoutProps = {
  // 指明一个字段组是怎么布局的
  // > 仅当 `group` 有效
  layout?: CssGridLayout;
  // 指定 layout 过于麻烦，并且不能自适应，那么可以通过这个属性进行定制
  // 它可以根据当前的视口宽度自动决定轨道数量
  // > 仅当 `group` 有效
  // > 如果已经指定了 `layout.gridTemplateColumns` 则会无视
  layoutHint?: GridLayoutHint;
  // 默认的，根据 layoutHint 计算出来的轨道数，每个轨道都是 1fr ，
  // 这里可以允许你根据轨道下标(0 base)指定每个轨道具体的宽度
  // > 仅当 `group` 有效
  // > 如果已经指定了 `layout.gridTemplateColumns` 则会无视
  // 对于 `sting[]` 类型支持下面的格式:
  // - `['1fr']` : 所有的轨道都是 `1fr`
  // - `['20%,1fr']` : 第一个轨道是 20%，之后都是 1fr
  // - `['#3:100px,1fr,200px', '#2:1fr,200px']`
  //    > 如果3个轨道，那么宽度依次是 100px, 1fr, 200px
  //    > 如果2个轨道，那么宽度依次是 1fr, 200px
  //    > 其他情况，每个轨道都是 1fr
  // 如果类型是 string 就相当于  [string]
  layoutGridTracks?: string | string[];

  customizedGridTracks?: GridLayoutTrackSizeCustomizedGetter;
};
