import { CssUtils } from '../../../core';
import { useObjFields } from '../../_features';
import { buildGridFields } from './build-grid-field';
import {
  GridFieldsFeature,
  GridFieldsProps,
  GridFieldsStrictField,
  GridFieldsStrictGroup,
  GridFieldsStrictItem,
  GridFieldsStrictLabel,
} from './ti-grid-fields-types';

export function useGridFields(props: GridFieldsProps): GridFieldsFeature {
  let _ofs = useObjFields(props.fieldSetName);
  let strictItems = buildGridFields(_ofs, [], props.fields || [], props);
  let fieldItems: GridFieldsStrictField[] = [];
  __join_strict_field_items(strictItems, fieldItems);

  return {
    strictItems,
    fieldItems,
    // 动态类选择器
    className: props.className
      ? CssUtils.mergeClassName(props.className)
      : undefined,
    // 标题 & 提示
    title: props.title ?? null,
    titleType: props.titleType || 'text',
    tip: props.tip ?? null,
    tipType: props.tipType || 'text',
    tipIcon: props.tipIcon || 'zmdi-help-outline',
    style: props.style,
  };
}

function __join_strict_field_items(
  items: GridFieldsStrictItem[],
  list: GridFieldsStrictField[] = []
): GridFieldsStrictField[] {
  for (let it of items) {
    // 标准字段
    if (isGridFieldsStrictField(it)) {
      list.push(it);
    }
    // 字段组
    else if (isGridFieldStrictsGroup(it)) {
      __join_strict_field_items(it.fields, list);
    }
  }
  return list;
}

export function isGridFieldStrictsGroup(
  item: GridFieldsStrictItem
): item is GridFieldsStrictGroup {
  return item && 'group' == item.race;
}

export function isGridFieldsStrictField(
  item: GridFieldsStrictItem
): item is GridFieldsStrictField {
  return item && 'field' == item.race;
}

export function isGridFieldStrictsLabel(
  item: GridFieldsStrictItem
): item is GridFieldsStrictLabel {
  return item && 'label' == item.race;
}
