import { Vars } from '../../../_type';
import { Str } from '../../../core';
import { InputBoxProps } from './ti-input-box2-types';
import _ from 'lodash';

export function useBoxDisplayText(props: InputBoxProps) {
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
