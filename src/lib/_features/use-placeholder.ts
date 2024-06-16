import { TextShowProps } from '.';
import { I18n } from '../../core';

export type PlaceholderProps = Pick<TextShowProps, 'autoI18n'> & {
  placeholder?: string;
};

// export type PlaceholderFeature = {
//   /**
//    * 返回占位符内容
//    */
//   getPlaceholder: {
//     (dft?: string): string | undefined;
//   };
// };

/**
 * ### 特性概述
 *
 * 输出一个函数， `tryPlaceholder(input:any):string|undefined`
 * 这个函数会判断输入，如果输入为 nil，那么就返回 `placeholder`。
 * 否则，就返回 `undefined`，表示输入值不需要占位符
 *
 * ### 使用场景：
 *
 * - `TILE`
 * - `EDIT`
 *
 * ### 输出
 *
 * - `default: ToStrMaybe<any>` : 可以用来格式化数据
 *
 */
export function usePlaceholder(props: PlaceholderProps): string {
  let placeholder = props.placeholder ?? '';
  let autoI18n = props.autoI18n ?? true;
  if (autoI18n && placeholder) {
    placeholder = I18n.text(placeholder);
  }
  return placeholder;
}
