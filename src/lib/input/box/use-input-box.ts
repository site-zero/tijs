import {
  ValueBoxFeature,
  ValueBoxOptions,
  ValueBoxProps,
  ValueBoxState,
  useValueBox,
} from '../../';
import { InputBoxProps } from './ti-input-types';
/*-----------------------------------------------------

                Type Defination

-----------------------------------------------------*/
export type InputBoxState = ValueBoxState<any>;
export type InputBoxOptions = ValueBoxOptions;
export type InputBoxFeature = ValueBoxFeature;

/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
export function useInputBox(
  state: InputBoxState,
  props: InputBoxProps,
  options: InputBoxOptions
): InputBoxFeature {
  return useValueBox(state, props, options);
}
