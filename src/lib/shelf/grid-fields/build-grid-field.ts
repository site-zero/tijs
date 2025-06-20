import _ from "lodash";
import { makeFieldUniqKey, parseFieldConverter, Vars } from "../../../_type";
import { CssUtils, Match } from "../../../core";
import {
  buildFieldValidatorGroup,
  TiObjFieldsFeature,
  useVisibility,
} from "../../_features";
import {
  FieldRefer,
  GridFieldsInput,
  GridFieldsProps,
  GridFieldsStrictAbstractItem,
  GridFieldsStrictField,
  GridFieldsStrictGroup,
  GridFieldsStrictItem,
} from "./ti-grid-fields-types";

export function buildOneGridField(
  fieldSet: TiObjFieldsFeature,
  indexes: number[],
  fr: FieldRefer,
  dft: GridFieldsProps
): GridFieldsStrictItem {
  let field: GridFieldsInput = fieldSet.getFieldBy(fr);

  let uniqKey = makeFieldUniqKey(indexes, field.name, field.uniqKey);
  // 可见性
  let visiblity = useVisibility(field, uniqKey);
  // let readonly = field.readonly ?? dft.readonly;
  // if (readonly) {
  //   visiblity.isDisabled = () => true;
  // }

  // 准备返回值
  let re: GridFieldsStrictAbstractItem = {
    // 唯一键
    uniqKey,
    // 下标
    index: _.nth(indexes, -1) ?? 0,
    race: "field",
    // 数据
    data: dft.data!,
    dynamic: field.dynamic ?? dft.dynamic,
    explainOptions: field.explainOptions ?? dft.explainOptions,
    vars: field.vars ?? dft.vars,

    // 动态类选择器
    className: field.className
      ? CssUtils.mergeClassName(field.className)
      : undefined,

    // 可见性
    ...visiblity,

    // 标题 & 提示
    title: field.title,
    titleType: field.titleType ?? "text",
    titleIcon: field.titleIcon,
    titleStyle: field.titleStyle,
    titleAlign: field.titleAlign ?? dft.fieldTitleAlign,
    titleTextStyle: field.titleTextStyle,
    titleClass: field.titleClass,
    tip: field.tip,
    tipType: field.tipType ?? "text",
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
    re.race = "field";
    let fld = re as GridFieldsStrictField;

    fld.name = field.name;
    fld.type = field.type ?? dft.defaultFieldType ?? "String";
    fld.typeTransformOptions =
      fld.typeTransformOptions ?? dft.defaultFieldTypeTransformOptions;
    fld.typeSerializeOptions =
      fld.typeSerializeOptions ?? dft.defaultFieldTypeSerializeOptions;
    fld.fieldTitleBy = field.fieldTitleBy ?? dft.defaultFieldTitleBy;
    fld.tipBy = field.tipBy ?? dft.defaultFieldTipBy;

    _.defaults(fld, {
      comType: dft.defaultComType,
      comConf: dft.defaultComConf,
    });

    if (field.required) {
      let _is_required = Match.parse(field.required, false);
      fld.isRequired = (data: Vars) => {
        // console.log(
        //   `[${fld.uniqKey}] isRequired`,
        //   _is_required,
        //   _.cloneDeep(data)
        // );
        // 如果
        return _is_required.test(data);
      };
    }

    fld.checkEquals = field.checkEquals ?? true;
    fld.emptyAs = field.emptyAs ?? null;
    fld.defaultAs = field.defaultAs ?? null;
    fld.changeEventName = field.changeEventName ?? "change";

    if (field.validation) {
      fld.validate = buildFieldValidatorGroup(field.validation);
    }

    fld.transformer = parseFieldConverter(
      fld.type,
      "transform",
      fld.typeTransformOptions,
      dft.vars || {},
      field.transformer,
      field.transArgs,
      field.transPartial
    );
    fld.serializer = parseFieldConverter(
      fld.type,
      "serialize",
      fld.typeSerializeOptions,
      dft.vars || {},
      field.serializer,
      field.serialArgs,
      field.serialPartial
    );

    fld.maxFieldNameWidth = field.maxFieldNameWidth ?? dft.maxFieldNameWidth;
    fld.tipIcon = field.tipIcon || "zmdi-help-outline";
    fld.fieldLayoutMode =
      field.fieldLayoutMode ?? dft.fieldLayoutMode ?? "h-title-icon-suffix";
    fld.titleTextStyle = field.titleTextStyle;
    fld.fieldValueStyle = field.fieldValueStyle;
    fld.tipTextStyle = field.tipTextStyle;
  }
  // ---------------: 分组 :---------------
  else if (field.fields) {
    re.race = "group";
    let grp = re as GridFieldsStrictGroup;
    grp.maxFieldNameWidth = field.maxFieldNameWidth ?? dft.maxFieldNameWidth;
    grp.layout = field.layout;
    grp.fieldTitleAlign = field.fieldTitleAlign ?? dft.fieldTitleAlign;
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
    grp.defaultFieldType = field.defaultFieldType ?? dft.defaultFieldType;
    grp.defaultFieldTypeTransformOptions =
      field.defaultFieldTypeTransformOptions ??
      dft.defaultFieldTypeTransformOptions;
    grp.defaultFieldTypeSerializeOptions =
      field.defaultFieldTypeSerializeOptions ??
      dft.defaultFieldTypeSerializeOptions;
    grp.defaultComType = field.defaultComType ?? dft.defaultComType;
    grp.defaultComConf = field.defaultComConf ?? dft.defaultComConf;

    // 递归构建嵌套子项目
    grp.fields = buildGridFields(
      fieldSet,
      indexes,
      field.fields,
      grp as GridFieldsInput
    );
  }
  // ---------------: 标签 :---------------
  else {
    re.race = "label";
  }

  return re as GridFieldsStrictItem;
}

export function buildGridFields(
  fieldSet: TiObjFieldsFeature,
  indexes: number[],
  fields: FieldRefer[],
  dft: GridFieldsInput
): GridFieldsStrictItem[] {
  let items: GridFieldsStrictItem[] = [];
  for (let i = 0; i < fields.length; i++) {
    let is = _.concat(indexes, i);
    let field = fields[i];
    let it = buildOneGridField(fieldSet, is, field, dft);
    // console.log(it.uniqKey, `[${it.title}]`);
    items.push(it);
  }
  return items;
}
