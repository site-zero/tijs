import { ItemLookupProps } from './use-item-lookup';
import { ValueHintCookingProps } from './use-value-hint-cooking';
import { ValueOptionsProps } from './use-value-options';
import { ValuePipeProps } from './use-value-pipe';

//--------------------------------------------------
export type InputBox2Emitter = {
  (event: 'change', value: string): void;
};

//--------------------------------------------------
export type InputBox2Props = ValuePipeProps &
  ValueOptionsProps &
  ValueHintCookingProps &
  ItemLookupProps & {
    value?: any;
  };
