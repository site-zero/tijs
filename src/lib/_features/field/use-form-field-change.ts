import _ from 'lodash';
import {
  buildGridFields,
  FieldRefer,
  getFieldValue,
  FormFieldItem,
  OneFormItem,
  useObjFields,
  Vars,
} from '../../../';
import { getFieldTextInfo } from '../../shelf/grid-fields/use-field-style';
import {
  FieldChangeApi,
  FieldChangeProps,
  FieldChangeValidateResult,
  useFieldChange,
} from './use-field-change';

export type FormFieldChangeApi = FieldChangeApi<FormFieldItem> & {
  /**
   * @returns 当前接口监控的字段列表
   */
  getWatchedFields: () => FormFieldItem[];

  /**
   * 将错误信息构建为 HTML 字符串。
   *
   * @param {FieldChangeValidateResult[]} errors 错误信息数组，包含错误唯一键和错误文本。
   * @param {Vars} data 数据对象，用于在错误信息中显示字段值。
   * @param {Vars} vars 补充上下文变量对象，用于在错误信息中进行替换。
   * @returns {string} 包含错误信息的 HTML 字符串。
   *
   * @example
   * ```typescript
   * const errors: FieldChangeValidateResult[] = [
   *   { uniqKey: 'name', text: '名称不能为空' },
   *   { uniqKey: 'age', text: '年龄必须大于 0' },
   * ];
   * const data: Vars = { name: '测试', age: -1 };
   * const vars: Vars = { labelName: '字段' };
   * const html = buildErrorMessageAsHtml(errors, data, vars);
   * console.log(html);
   * // 输出:
   * // <ol>
   * //   <li><strong>名称</strong> : <code>测试</code> : <em>名称不能为空</em></li>
   * //   <li><strong>年龄</strong> : <code>-1</code> : <em>年龄必须大于 0</em></li>
   * //</ol>
   * ```
   */
  buildErrorMessageAsHtml: (
    errors: FieldChangeValidateResult[],
    data?: Vars,
    vars?: Vars
  ) => string;
};

export function useFormFieldChange(
  props: FieldChangeProps<FormFieldItem>,
  fields: FieldRefer[],
  fieldSetName?: string
): FormFieldChangeApi {
  // 预先编译字段
  const _ofs = useObjFields(fieldSetName);
  const fld_items = buildGridFields(
    _ofs,
    [],
    fields,
    {}
  ) as OneFormItem[];
  //--------------------------------------------------------------
  // 递归收集所有真正的字段
  const read_fields: FormFieldItem[] = [];
  function __join_real_fields(items: OneFormItem[]) {
    for (const item of items) {
      if (item.race === 'field') {
        read_fields.push(item);
      }
      // 递归
      else if (item.race === 'group' && !_.isEmpty(item.fields)) {
        __join_real_fields(item.fields);
      }
    }
  }
  //--------------------------------------------------------------
  // 构建监控字段表
  __join_real_fields(fld_items);
  //--------------------------------------------------------------
  // 构建 API
  //--------------------------------------------------------------
  const changeApi = useFieldChange(props, read_fields);
  //--------------------------------------------------------------
  // 补充方法
  //--------------------------------------------------------------
  function buildErrorMessageAsHtml(
    errors: FieldChangeValidateResult[],
    data: Vars = {},
    vars: Vars = {}
  ): string {
    let ctx = { ...vars, data };
    let html = ['<ol>'];
    for (let err of errors) {
      let fld = changeApi.getField(err.uniqKey);
      if (!fld) {
        continue;
      }
      let { title, titleType = 'text' } = getFieldTextInfo(fld, ctx);
      html.push('<li>');
      if ('html' === titleType) {
        html.push(title);
      } else {
        html.push(`<strong>${title}</strong>`);
      }
      let val = getFieldValue(fld.name, data);
      if (
        _.isNumber(val) ||
        _.isBoolean(val) ||
        _.isDate(val) ||
        (!_.isEmpty(val) && !_.isNil(val))
      ) {
        html.push(` : <code>${val}</code>`);
      }
      html.push(` : <em>${err.text}</em>`);
      html.push('</li>');
    }
    html.push('</ol>');
    return html.join('');
  }
  //--------------------------------------------------------------
  // 返回特性
  //--------------------------------------------------------------
  return {
    ...changeApi,
    getWatchedFields: () => read_fields,
    buildErrorMessageAsHtml,
  };
}
