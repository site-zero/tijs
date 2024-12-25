import { Vars } from '../../_type';
import { Str } from '../../core';

import _ from 'lodash';

export type DisplayTextProps = {
  /**
   * 指定输入框显示文字的获取方式
   * 默认为 'text|value'
   * 如果指定了 useRawValue 相当于 'value'
   * 也可以指定为 'tip|value|text'等
   */
  getDisplayText?: string;

  /**
   * 如果值是某个选项，默认的会在输入框显示选项的文字而不是值。
   * 开启这个选项，则在输入框直接显示值而不是翻译后的文字
   */
  useRawValue?: boolean;
};

export function useDisplayText(props: DisplayTextProps) {
  // 分析参数
  let { getDisplayText } = props;
  if (!getDisplayText) {
    if (props.useRawValue) {
      getDisplayText = 'value';
    } else {
      getDisplayText = 'text|value';
    }
  }

  // 拆分键
  let keys = Str.splitIgnoreBlank(getDisplayText, '|');

  // 返回
  return (item: Vars) => {
    for (let key of keys) {
      let v = item[key];
      if (!_.isNil(v)) {
        return v;
      }
    }
  };
}
