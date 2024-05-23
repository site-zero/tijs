import {
  ValueBoxEmits,
  ValueBoxOptions,
  ValueBoxProps,
  ValueBoxState,
  useValueBox,
} from '../../';
/*-----------------------------------------------------

                Type Defination

-----------------------------------------------------*/
export type LabelState = ValueBoxState<any>;
export type LabelProps = ValueBoxProps<any>;
export type LabelOptions = ValueBoxOptions;

/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
export function useLabel(
  state: LabelState,
  props: LabelProps,
  options: LabelOptions
) {
  return useValueBox(state, props, options);
}
