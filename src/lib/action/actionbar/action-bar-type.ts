import { InjectionKey } from 'vue';
import {
  AltBarItemisplay,
  BarItem,
  Callback,
  TiBus,
  TiMatch,
  Vars,
} from '../../../core';

export const BAR_BUS_KEY: InjectionKey<TiBus<BuiltedBarItem>> =
  Symbol('BUS_KEY');

export type BarItemOpenStatus = 'open' | 'ready';

/**
 * 为每个动作项建立一个层级关系映射:
 *
 * ```json5
 * {
 *    uniqKey1: [uniqKey2, uniqKey3, ...]
 * }
 * ```
 *
 * 一个项目的唯一键，对应的数组是这个动作项所有的祖先组 ID。
 * 祖先组的顺序是从根组至父组。
 * 因此，所有根组项目，值都是 `[]`
 *
 * @see action-bar-item.ts#buildItemsAncestors
 */
export type ItemAncestors = Map<string, string[]>;

export type BarState = {
  /**
   * 哪些组是打开的
   *
   * 如果值是个 `open` 则表示这个组被打开，
   * 但是还未计算自动停靠，如果是 `ready 则表示已经
   * 计算出了停靠的后的 CSS，并已经设置了 dom 的 style
   */
  opened: Map<string, BarItemOpenStatus>;

  /**
   * 上下文变量
   */
  vars: Vars;
};

export type BuiltedBarItem = BarItem & {
  uniqKey: string;
  /**
   * 动作项本层下标， 0 Base
   */
  index: number;
  /**
   * 动作项的深度， 0 Base
   */
  depth: number;
  /**
   * 对于 `folder-group` 是否是打开的状态
   */
  opened?: BarItemOpenStatus;
  altDisplay?: AltBarItemisplay<TiMatch>[];
  className: Vars;
  style?: Vars;
  items?: BuiltedBarItem[];
  action?: Callback;
};

export type BarItemProp = BuiltedBarItem & {
  ancestors: ItemAncestors;
};

export type BarSupport = {
  MENU_SPACE: number;
  makeSureOpen: (uniqKey: string | string[]) => void;
  setBarOpenState: (uniqKey: string, status: BarItemOpenStatus | null) => void;
  clearBarOpenState: (...uniqKeys: string[]) => void;
  clearBarOpenStateExcept: (...uniqKeys: string[]) => void;
};

export const BAR_SUPPORT: InjectionKey<BarSupport> = Symbol('BAR_SUPPORT');
