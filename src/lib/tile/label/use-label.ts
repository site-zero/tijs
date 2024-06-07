import { useValueBox } from '../../';
import { LabelOptions, LabelProps, LabelState } from './ti-label-types';

export function useLabel(
  state: LabelState,
  props: LabelProps,
  options: LabelOptions
) {
  return useValueBox(state, props, options);
}
