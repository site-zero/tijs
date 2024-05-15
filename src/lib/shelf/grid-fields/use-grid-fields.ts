import { CssUtils } from '../../../core';
import { buildGridFields } from './build-grid-field';
import { GridFieldsProps } from './ti-grid-fields-types';

export function useGridFields(props: GridFieldsProps) {
  let strictItems = buildGridFields([], props.fields || [], props);

  return {
    strictItems,
    // 动态类选择器
    className: props.className
      ? CssUtils.mergeClassName(props.className)
      : undefined,
    // 标题 & 提示
    title: props.title ?? null,
    titleType: props.titleType || 'text',
    titleBy: props.titleBy ?? null,
    tip: props.tip ?? null,
    tipType: props.tipType || 'text',
    tipMode: props.tipMode || 'name-suffix-icon',
    tipIcon: props.tipIcon || 'zmdi-help-outline',
    style: props.style,
  };
}
