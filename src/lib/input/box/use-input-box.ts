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
export type InputBoxState = ValueBoxState<any>;
export type InputBoxProps = ValueBoxProps<any> & {
  hideBorder?: boolean;
  boxFocused?:boolean;
};
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
