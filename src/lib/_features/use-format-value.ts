import _ from 'lodash';
import { Convertor, FuncA1, FuncA3, Render, Vars } from '../../_type';
import { Str, Tmpl } from '../../core';

export type FormatValueProps = {
  /**
   * 为格式化器，传入更多的参数
   */
  vars?: Vars;

  /**
   * 一个格式化执行器就是一个函数，接受两个输入，一个是当前控件值，一个是格式化上下文
   * 变量。这本来没有什么问题，但是为了你使用的便利，你可以把一个字符串作为格式执行器。
   *
   * 我们认为你传入的字符串就是一个字符串模板，它支持动态占位符。
   * 默认的，我们会在 `${val}` 处插入你的控件值。 如果这个模板还有其他的占位符变量，
   * 你需要用 `vars` 属性来填充。
   *
   * 这本来没什么问题，但是某些时候，你还传入的 `vars`，已经有一个 `val` 变量，
   * 并且你还不是很好修改（可能会影响你程序的其他地方）。
   *
   * 这种情况下你希望的是，能不能由你来指定一个绝对没有副作用的变量名，譬如 `_val2_`，
   * 就绝对不会有冲突了。
   */
  valueKeyOfVars?: string;

  /**
   * 控件值格式化器。它的渲染上下文为:
   *
   * ```
   * {[key]:val, ...vars}
   *  - key: 上下文键，默认为 `val` 通过 `valueKeyOfVars` 来指定
   *  - val: 输入框传入的值
   *  - vars: 参加 `vars` 属性
   * ```
   *
   * 它有下面两种形式：
   *
   * 1. string - 字符串模板, 渲染上下文为
   * 2. `((input:any, item?:Vars)=>string)`  自定义格式函数
   *    - input: 就是渲染上下文
   *    - item: 如果输入框带选项，就会也传入进来
   */
  format?: string | ((input: any, item?: Vars) => string);
};

/**
 * ### 特性概述
 *
 * 为控件带来格式化值的能力
 *
 * ### 使用场景：
 *
 * - `TILE`
 * - `EDIT`
 */
export type FormatValueFeature = {
  (input: any, item?: Vars): string;
};

export type FormatValueOptions = {
  nilFormat: FuncA1<Vars, Convertor<any, string>>;
  strFormat: FuncA3<string, Vars, string, Convertor<any, string>>;
};

export function useFormatValue(
  props: FormatValueProps,
  options = {
    nilFormat: (_vars) => (input) => {
      return Str.anyToStr(input);
    },
    strFormat:
      (format, vars = {}, valueKeyOfVars = 'val') =>
      (input: any) => {
        let tmpl = Tmpl.parse(format as string);
        let c = _.cloneDeep(vars) ?? {};
        c[valueKeyOfVars] = input;
        return tmpl.render(c);
      },
  } as FormatValueOptions
): FormatValueFeature {
  let __create_formatter = (): ((input: any, item?: Vars) => string) => {
    let { format, valueKeyOfVars, vars } = props;
    // 默认直接转字符串
    if (_.isNil(format)) {
      return options.nilFormat(vars || {});
    }

    // 采用字符串模板来格式化
    if (_.isString(format)) {
      return options.strFormat(format, vars || {}, valueKeyOfVars || 'val');
    }
    // 直接就是函数
    let customized_formater: Render<any, string> = format;
    return (input, item) => {
      let c = _.cloneDeep(vars) ?? {};
      let k = valueKeyOfVars ?? 'val';
      c[k] = input;
      return customized_formater(c, item);
    };
  };

  let formatter = __create_formatter();

  return (input: any, item?: Vars) => {
    return formatter(input, item);
  };
}
