import _ from 'lodash';
import { Rect } from '../../../core';
import { ListProps } from '../../../lib';
import { TipBoxProps } from './ti-input-types';

export type TipBoxOptions = {
  /**
   * 是否启用提示框，如果未定义，则看是否提供了提示框的宿主位置以及选项表
   */
  enabled?: boolean;

  /**
   * @returns 提示框的宿主矩形（窗口坐标系）
   */
  getHostElement?: () => Rect;

  /**
   * 获取提示的方法
   */
  getOptions?: (signal?: AbortSignal) => Promise<void>;
};

export function useTipBox(_props: TipBoxProps) {}

export function getTipListConf(props?: ListProps) {
  let re = _.assign(
    {
      size: 's',
      selectable: true,
      hoverable: true,
      allowUserSelect: false,
      borderStyle: 'dotted',
    } as ListProps,
    props
  );

  return re;
}
