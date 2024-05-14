import _ from 'lodash';
import { getFieldUniqKey, useVisibility } from '../../';
import {
  CssUtils,
  FuncA2,
  I18n,
  Match,
  Util,
  Vars,
  invoke_partial,
} from '../../../core';
import { FieldProps } from '../field/use-field';
import { FormField, FormFieldAboutProps, FormItem } from './ti-form-types';
import { buildFieldItemStyle, normalizeGridLayout } from './use-form-layout';

/*-----------------------------------------------------

                 Buiding Functions
                
-----------------------------------------------------*/
/**
 * 构建表单项列表
 */
export function buildFormFieldList(
  props: FormFieldAboutProps,
  fields: FormField[],
  context: Vars,
  indexes: number[] = [],
  maxFieldNameWidth?: number
): FormItem[] {
  let list = [] as FormItem[];
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    let fld = buildFormField(
      _.concat(indexes, i),
      props,
      field,
      context,
      maxFieldNameWidth
    );
    if (fld) {
      list.push(fld);
    }
  }
  return list;
}

/**
 * 构建一个表单项
 *
 * @param props: 表单的属性
 * @param field 表单字段属性
 * @param vars 通常是 form.vars & form.data
 */
function buildFormField(
  indexes: number[],
  props: FormFieldAboutProps,
  field: FormField,
  vars: Vars,
  maxFieldNameWidth?: number
): FormItem | undefined {
  maxFieldNameWidth =
    field.maxFieldNameWidth ?? maxFieldNameWidth ?? props.maxFieldNameWidth;
  let uniqKey =
    field.uniqKey ||
    (field.name ? getFieldUniqKey(field.name) : `_F${indexes.join('_')}`);

  let title = field.title ? I18n.text(field.title) : undefined;
  let fItem = {
    uniqKey,
    title,
    className: field.className,
    maxFieldNameWidth,
  } as FormItem;

  // 准备字段的样式(包括 Grid 布局的自定义属性)
  fItem.style = buildFieldItemStyle(field);

  // 字段组
  if (field.fields) {
    fItem.race = 'group';

    // 记入默认组样式
    fItem.className = CssUtils.mergeClassName(
      field.className ?? props.defaultGroupClassName ?? 'as-legend'
    );

    // 字段组布局
    if (field.layout) {
      fItem.layout = normalizeGridLayout(field.layout);
    }
    // 采用表单布局
    else if (props.layout) {
      fItem.layout = normalizeGridLayout(props.layout);
    }
    // 默认布局
    else {
      fItem.layout = {
        autoGrid: [[5, 1500], [4, 1200], [3, 900], [2, 500], 1],
      };
    }
    fItem.fields = buildFormFieldList(
      props,
      field.fields,
      vars,
      indexes,
      maxFieldNameWidth
    );
    // 空组就无视
    if (_.isEmpty(fItem.fields)) {
      return;
    }
  }
  // 标签字段
  else if (!field.name) {
    fItem.race = 'label';
    fItem.className = CssUtils.mergeClassName(
      field.className ?? props.defaultLabelClassName
    );
  }
  // 普通字段
  else {
    fItem.race = 'field';
    fItem.className = CssUtils.mergeClassName(
      field.className ?? props.defaultFieldClassName
    );
    // 测试显示隐藏性
    let { isHidden, isDisabled } = useVisibility(field);
    if (isHidden(vars)) {
      return;
    }
    fItem.props = {
      title,
      name: field.name,
      type: field.type ?? props.defaultFieldType,
      tip: field.tip,

      comType: field.comType ?? props.defaultComType,
      comConf: field.comConf ?? props.defaultComConf,
      readonlyComType: field.readonlyComType,
      readonlyComConf: field.readonlyComConf,

      status: _.get(props.fieldStatus, uniqKey),
      checkEquals: field.checkEquals,
    } as FieldProps;
    fItem.props.disabled = isDisabled(vars);

    // Get required and readonly
    if (field.readonly) {
      fItem.props.readonly = Match.test(field.readonly, vars);
    }

    // Get required and readonly
    if (field.required) {
      fItem.props.required = Match.test(field.required, vars);
    }

    // transformer
    if (field.transformer) {
      fItem.props.transformer = prepareFieldConverter(
        vars,
        field.transformer,
        field.transArgs,
        field.transPartial
      );
    }

    // serializer
    if (field.serializer) {
      fItem.props.serializer = prepareFieldConverter(
        vars,
        field.serializer,
        field.serialArgs,
        field.serialPartial
      );
    }
  }

  return fItem;
}

function prepareFieldConverter(
  context: Vars,
  converter: string | Function,
  args?: any[],
  partial?: invoke_partial
): FuncA2<any, Vars, any> {
  let conv = Util.genInvoking(converter, {
    context,
    args,
    partial: partial || 'right',
  });
  return (val: any, data: Vars) => {
    return conv(val, data);
  };
}
