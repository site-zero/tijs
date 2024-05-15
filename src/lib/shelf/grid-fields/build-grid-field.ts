import _ from 'lodash';
import { CssUtils, Match, Vars } from '../../../core';
import { getFieldUniqKey } from '../../../lib/_top';
import {
  GridFieldsInput,
  GridFieldsStrictAbstractItem,
  GridFieldsStrictField,
  GridFieldsStrictGroup,
  GridFieldsStrictItem,
} from './ti-grid-fields-types';

function makeFieldUniqKey(indexes: number[], field: GridFieldsInput): string {
  if (field.uniqKey) {
    return field.uniqKey;
  }
  if (field.name) {
    return getFieldUniqKey(field.name);
  }
  return `_F${indexes.join('_')}`;
}

export function buildOneGridField(
  indexes: number[],
  field: GridFieldsInput,
  dft: GridFieldsInput
): GridFieldsStrictItem {
  // 准备返回值
  let re: GridFieldsStrictAbstractItem = {
    // 下标
    index: _.nth(indexes, -1) ?? 0,
    race: 'field',
    // 唯一键
    uniqKey: makeFieldUniqKey(indexes, field),
    // 动态类选择器
    className: field.className
      ? CssUtils.mergeClassName(field.className)
      : undefined,
    // 标题 & 提示
    title: field.title ?? null,
    titleType: field.titleType || 'text',
    tip: field.tip ?? null,
    tipType: field.tipType || 'text',
    style: field.style,
    readonly: field.readonly,
    autoValue: field.autoValue,
    comType: field.comType,
    comConf: field.comConf,
    readonlyComType: field.readonlyComType,
    readonlyComConf: field.readonlyComConf,
    activatedComType: field.activatedComType,
    activatedComConf: field.activatedComConf,
    changeEventName: field.changeEventName ?? 'change',
  };

  // 自动得到控件族类
  if (field.name) {
    re.race = 'field';
    let fld = re as GridFieldsStrictField;
    let isRequired = Match.parse(field.required, false);
    fld.required = (data: Vars) => isRequired.test(data);
    fld.fieldNameBy = field.fieldNameBy;
    fld.fieldTipBy = field.fieldTipBy;
    fld.checkEquals = field.checkEquals ?? true;
    fld.maxFieldNameWidth = field.maxFieldNameWidth ?? dft.maxFieldNameWidth;
    fld.tipIcon = field.tipIcon || 'zmdi-help-outline';
    fld.fieldLayoutMode =
      field.fieldLayoutMode ?? dft.fieldLayoutMode ?? 'h-name-icon-suffix';
    fld.fieldNameStyle = field.fieldNameStyle;
    fld.fieldValueStyle = field.fieldValueStyle;
    fld.fieldTipStyle = field.fieldTipStyle;
  }
  // 分组
  else if (field.fields) {
    re.race = 'group';
    let grp = re as GridFieldsStrictGroup;
    grp.maxFieldNameWidth = field.maxFieldNameWidth ?? dft.maxFieldNameWidth;
    grp.layout = field.layout;
    grp.layoutHint = field.layoutHint;
    grp.layoutGridTracks = field.layoutGridTracks;
    grp.fields = buildGridFields(indexes, field.fields, grp as GridFieldsInput);
    grp.fieldLayoutMode = field.fieldLayoutMode ?? dft.fieldLayoutMode;
  }
  // 标签
  else {
    re.race = 'label';
  }

  return re as GridFieldsStrictItem;
}

export function buildGridFields(
  indexes: number[],
  fields: GridFieldsInput[],
  dft: GridFieldsInput
): GridFieldsStrictItem[] {
  let items: GridFieldsStrictItem[] = [];
  for (let i = 0; i < fields.length; i++) {
    let is = _.concat(indexes, i);
    let field = fields[i];
    let it = buildOneGridField(is, field, dft);
    items.push(it);
  }
  return items;
}
