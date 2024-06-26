import _ from 'lodash';
import { Rect, Vars } from '../../../_type';
import { CssUtils, Match, Util } from '../../../core';
import { ListProps, getDockingStyle } from '../../../lib';
import { OptionPredicateMaker, TipBoxProps } from './ti-input-types';

export function getTipListConf(props?: ListProps) {
  let re = _.assign(
    {
      size: 's',
      canSelect: true,
      canHover: true,
      allowUserSelect: false,
      borderStyle: 'solid',
    } as ListProps,
    props
  );
  re.className = CssUtils.mergeClassName(
    {
      'tip-block': true,
    },
    props?.className
  );
  return re;
}

export function getTipWrapperStyle(
  props: TipBoxProps,
  $el?: HTMLElement,
  box?: Rect
): Vars {
  return getDockingStyle(
    {
      minWidth: `${_.get(box, 'width')}px`,
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
