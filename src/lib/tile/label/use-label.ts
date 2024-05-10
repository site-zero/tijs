import {
  ValueBoxFeature,
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
export type LabelFeature = ValueBoxFeature;

/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
export function useLabel(
  state: LabelState,
  props: LabelProps,
  options: LabelOptions
): LabelFeature {
  return useValueBox(state, props, options);
}
