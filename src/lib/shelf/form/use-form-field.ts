import _ from "lodash";
import {
  CommonProps,
  Field,
  FieldComProps,
  FieldStatus,
  FieldStatusIcons,
  FieldValueType,
  VisibilityProps,
  getFieldUniqKey,
  useVisibility
} from "../../";
import {
  CssGridItem,
  CssUtils,
  FuncA2,
  I18n,
  Match,
  Util,
  Vars,
  invoke_partial
} from "../../../core";
import { FieldProps } from "../field/use-field";
import {
  AutoGridHint,
  FormGridLayout,
  buildFieldItemStyle,
  normalizeGridLayout
} from "./use-form-layout";

/*-----------------------------------------------------

                Field About Props in Form
                
-----------------------------------------------------*/
export type FormFieldAboutProps = {
  /**
   * 表单所有字段都是只读
   *
   * @default false
   */
  readonly?: boolean;
  /**
   * 字段状态对象
   */
  fieldStatus?: {
    [k: string]: FieldStatus;
  };

  defaultGroupClassName?: string;
  defaultLabelClassName?: string;
  defaultFieldClassName?: string;

  /**
   * 默认的字段类型
   *
   * @default `String`
   */
  defaultFieldType?: FieldValueType;

  /**
   * 默认的字段控件类型
   *
   * @default `TiLabel`
   */
  defaultComType?: string;

  /**
   * 默认的字段控件配置信息
   *
   * @default `TiLabel`
   */
  defaultComConf?: Vars;
  /**
   * 每种字段状态的显示图标
   */
  statusIcons?: FieldStatusIcons;

  //-----------------------------------
  //
  // Batch Behavior
  //
  //-----------------------------------
  // Batch fields hint
  batchHint?: any[];

  /**
   * 是否进入批量模板模式，如果未指定，则参看 `batchHint`
   * 是不是传入了多个参考对象
   */
  batchMode?: boolean;

  /**
   * 哪些字段在 `batch` 模式下是只读的，这个判断会被编译为 `TiMatch`
   */
  batchReadonly?: any;

  /**
   * 如果未声明 `autoGrid` 表示进入自动模式。
   * 即 `templateRow / templateColumns` 是要自动计算的，计算的方法：
   *
   * gridAutoFlow = row | dense
   * {
   *    gridTemplateColumns : 计算(View.width, autoGrid)
   *    gridTemplateRows    : "auto"
   * }
   * gridAutoFlow = column
   * {
   *    gridTemplateColumns : "auto",
   *    gridTemplateRows    : 计算(View.height, autoGrid)
   * }
   *
   *
   * @default ` [ [5, 1500], [4, 1200], [3,900], [2, 500], 1 ]`
   */
  layout?: AutoGridHint | FormGridLayout;
  //-----------------------------------
  // Measure
  //-----------------------------------
  maxFieldNameWidth?: number;
};

/*-----------------------------------------------------

                 Field Defination (Props)
                
-----------------------------------------------------*/
export type FormField = CommonProps &
  Partial<Omit<Field, "transformer" | "serializer">> &
  FieldComProps &
  VisibilityProps &
  CssGridItem & {
    title?: string;
    tip?: string;
    /**
     * 字段是否只读，是一个 `TiMatch` 匹配 `FormContext`
     */
    readonly?: any;
    /**
     * 字段是否必选，是一个 `TiMatch` 匹配 `FormContext`
     */
    required?: any;

    // 限制一个字段名称最大宽度
    maxFieldNameWidth?: number;

    // Group only
    layout?: AutoGridHint | FormGridLayout;

    style?: Vars;

    /**
     * 如果是个字段组，则显示子字段
     */
    fields?: FormField[];

    checkEquals?: boolean;
    transformer?: string | Function;
    transArgs?: any[];
    transPartial?: invoke_partial;
    serializer?: string | Function;
    serialArgs?: any[];
    serialPartial?: invoke_partial;
  };

/*-----------------------------------------------------

                  Form Item 

              group | label | field
                
-----------------------------------------------------*/

export type FormItemRace = "group" | "label" | "field";

export type FormItem = {
  uniqKey: string;
  race: FormItemRace;
  title?: string;
  className?: Vars;
  style: Vars;
  // 限制一个字段名称最大宽度
  maxFieldNameWidth?: number;
  // Group
  fields?: FormItem[];
  layout?: FormGridLayout;
  // Normal Field
  props?: FieldProps;
};

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
    (field.name ? getFieldUniqKey(field.name) : `_F${indexes.join("_")}`);

  let title = field.title ? I18n.text(field.title) : undefined;
  let fItem = {
    uniqKey,
    title,
    className: field.className,
    maxFieldNameWidth
  } as FormItem;

  // 准备字段的样式(包括 Grid 布局的自定义属性)
  fItem.style = buildFieldItemStyle(field);

  // 字段组
  if (field.fields) {
    fItem.race = "group";

    // 记入默认组样式
    fItem.className = CssUtils.mergeClassName(
      field.className ?? props.defaultGroupClassName ?? "as-legend"
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
        autoGrid: [[5, 1500], [4, 1200], [3, 900], [2, 500], 1]
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
    fItem.race = "label";
    fItem.className = CssUtils.mergeClassName(
      field.className ?? props.defaultLabelClassName
    );
  }
  // 普通字段
  else {
    fItem.race = "field";
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
      checkEquals: field.checkEquals
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
    partial: partial || "right"
  });
  return (val: any, data: Vars) => {
    return conv(val, data);
  };
}
