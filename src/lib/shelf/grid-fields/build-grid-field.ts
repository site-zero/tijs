import _ from 'lodash';
import { CssUtils, Match, Vars } from '../../../core';
import { makeFieldUniqKey, parseFieldConverter } from '../../../lib/_top';
import { useVisibility } from '../../_features';
import {
  GridFieldsInput,
  GridFieldsProps,
  GridFieldsStrictAbstractItem,
  GridFieldsStrictField,
  GridFieldsStrictGroup,
  GridFieldsStrictItem,
} from './ti-grid-fields-types';

export function buildOneGridField(
  indexes: number[],
  field: GridFieldsInput,
  dft: GridFieldsProps
): GridFieldsStrictItem {
  let uniqKey = makeFieldUniqKey(indexes, field.name, field.uniqKey);
  // 准备返回值
  let re: GridFieldsStrictAbstractItem = {
    // 唯一键
    uniqKey,
    // 下标
    index: _.nth(indexes, -1) ?? 0,
    race: 'field',
    // 数据
    data: dft.data!,

    // 动态类选择器
    className: field.className
      ? CssUtils.mergeClassName(field.className)
      : undefined,

    // 可见性
    ...useVisibility(field, uniqKey),

    // 标题 & 提示
    title: field.title ?? null,
    titleType: field.titleType ?? 'text',
    titleIcon: field.titleIcon,
    titleStyle: field.titleStyle,
    titleAlign: field.titleAlign,
    titleClass: field.titleClass,
    tip: field.tip ?? null,
    tipType: field.tipType ?? 'text',
    tipBy: field.tipBy,
    tipStyle: field.tipStyle,
    tipAlign: field.tipAlign,
    tipClass: field.tipClass,

    rowStart: field.rowStart,
    rowSpan: field.rowSpan,
    colStart: field.colStart,
    colSpan: field.colSpan,

    style: field.style,
    readonly: field.readonly ?? dft.readonly,
    autoValue: field.autoValue,
    comType: field.comType,
    comConf: field.comConf,
    readonlyComType: field.readonlyComType,
    readonlyComConf: field.readonlyComConf,
    activatedComType: field.activatedComType,
    activatedComConf: field.activatedComConf,
  };

  // ---------------: 普通字段 :---------------
  if (field.name) {
    re.race = 'field';
    let fld = re as GridFieldsStrictField;

    fld.name = field.name;
    fld.type = field.type ?? 'String';
    fld.fieldTitleBy = field.fieldTitleBy ?? dft.defaultFieldTitleBy;
    fld.tipBy = field.tipBy ?? dft.defaultFieldTipBy;

    _.defaults(fld, {
      comType: dft.defaultComType,
      comConf: dft.defaultComConf,
    });

    let isRequired = Match.parse(field.required, false);
    fld.required = (data: Vars) => isRequired.test(data);

    fld.checkEquals = field.checkEquals ?? true;
    fld.emptyAs = field.emptyAs ?? null;
    fld.defaultAs = field.defaultAs ?? null;
    fld.changeEventName = field.changeEventName ?? 'change';

    fld.transformer = parseFieldConverter(
      field.type ?? 'String',
      'transform',
      dft.vars || {},
      field.transformer,
      field.transArgs,
      field.transPartial
    );
    fld.serializer = parseFieldConverter(
      field.type ?? 'String',
      'serialize',
      dft.vars || {},
      field.serializer,
      field.serialArgs,
      field.serialPartial
    );

    fld.maxFieldNameWidth = field.maxFieldNameWidth ?? dft.maxFieldNameWidth;
    fld.tipIcon = field.tipIcon || 'zmdi-help-outline';
    fld.fieldLayoutMode =
      field.fieldLayoutMode ?? dft.fieldLayoutMode ?? 'h-title-icon-suffix';
    fld.titleTextStyle = field.titleTextStyle;
    fld.fieldValueStyle = field.fieldValueStyle;
    fld.tipTextStyle = field.tipTextStyle;
  }
  // ---------------: 分组 :---------------
  else if (field.fields) {
    re.race = 'group';
    let grp = re as GridFieldsStrictGroup;
    grp.maxFieldNameWidth = field.maxFieldNameWidth ?? dft.maxFieldNameWidth;
    grp.layout = field.layout;
    grp.layoutHint = field.layoutHint;
    grp.layoutGridTracks = field.layoutGridTracks;
    grp.fieldLayoutMode = field.fieldLayoutMode ?? dft.fieldLayoutMode;
    grp.defaultFieldTitleBy =
      field.defaultFieldTitleBy ?? dft.defaultFieldTitleBy;
    grp.defaultFieldTipBy = field.defaultFieldTipBy ?? dft.defaultFieldTipBy;
    grp.groupAspect = field.groupAspect ?? dft.groupAspect;
    grp.bodyPartDense = field.bodyPartDense;
    grp.bodyPartFontSize = field.bodyPartFontSize;
    grp.bodyPartStyle = field.bodyPartStyle;
    grp.bodyPartGap = field.bodyPartGap ?? dft.bodyPartGap;
    grp.defaultComType = field.defaultComType ?? dft.defaultComType;
    grp.defaultComConf = field.defaultComConf ?? dft.defaultComConf;

    // 递归构建嵌套子项目
    grp.fields = buildGridFields(indexes, field.fields, grp as GridFieldsInput);
  }
  // ---------------: 标签 :---------------
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
