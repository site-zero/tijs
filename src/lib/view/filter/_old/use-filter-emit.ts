import _ from 'lodash';
import { FilterProps, FilterValue } from './ti-filter-types';
import { FilterEmitter } from './use-filter';

export function useFilterEmit(
  props: FilterProps,
  _emit: FilterEmitter
): FilterEmitter {
  return (event: string, payload?: any) => {
    // Change
    if (event === 'change') {
      let fval = {} as FilterValue;
      // 保持全部值
      if (props.keepNilValue) {
        _.assign(fval, payload);
      }
      // 过滤空值
      else {
        _.forEach(payload, (v, k) => {
          if (!_.isNil(v)) {
            fval[k] = v;
          }
        });
      }
      _emit('change', fval);
    }
    // Search | Reset
    else if (event === 'search' || event === 'reset') {
      _emit(event);
    }
    // Change major
    else if (event === 'change-major') {
      _emit('change-major', payload ?? []);
    }
    // Rest major
    else if (event === 'reset-major') {
      _emit('reset-major');
    }
    // Invalide Event
    else {
      throw new Error(`Unhandled event: ${event}`);
    }
  };
}
