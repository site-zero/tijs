import _ from 'lodash';
import { Rect, Vars } from '../../../_type';
import { CssUtils, Match, Util } from '../../../core';
import { ListProps, getDockingStyle } from '../../../lib';
import {
  OptionPredicateMaker,
  QuickTipFormat,
  TipBoxProps,
} from './ti-input-types';

export function getTipListConf(props?: ListProps, tipFormat?: QuickTipFormat) {
  // 准列表
  let re: ListProps = _.assign(
    {
      size: 's',
      canSelect: true,
      canHover: true,
      allowUserSelect: false,
      borderStyle: 'solid',
    } as ListProps,
    props
  );
  // 设置快速格式化
  if (!re.textFormat && tipFormat) {
    re.textFormat = {
      T: `<em>\${text}</em>`,
      VT: `<code>\${value}:</code><em>\${text}</em>`,
      TV: `<em>\${text}</em><code>:\${value}</code>`,
      TT: `<em>\${text}</em><abbr>\${tip}</abbr>`,
      VTT: `<code>\${value}:</code><em>\${text}</em><abbr>\${tip}</abbr>`,
    }[tipFormat];
  }

  return re;
}

export function getTipWrapperStyle(
  props: TipBoxProps,
  $el?: HTMLElement,
  box?: Rect
): Vars {
  return getDockingStyle(
    {
      minWidth: props.tipListMinWidth ?? `${_.get(box, 'width')}px`,
      width: props.tipListWidth,
    },
    $el,
    box
  );
}

export function makeOptionPredicate(props: TipBoxProps): OptionPredicateMaker {
  if (props.optionFilter) {
    // 如果是函数
    if (_.isFunction(props.optionFilter)) {
      return props.optionFilter as OptionPredicateMaker;
    }
    // 否则，就是对象
    return (vars: Vars) => {
      let m_input = props.optionFilter;
      if (!_.isEmpty(vars)) {
        m_input = Util.explainObj(vars, props.optionFilter);
      }
      let _mat = Match.parse(m_input, false);
      return (item: Record<string, any>) => {
        return _mat.test(item);
      };
    };
  }
  return (_vars: Vars) => {
    return () => true;
  };
}
