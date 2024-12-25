import { DictProps, DisplayTextProps, PlaceholderProps, ValuePipeProps } from '../../';
import {
  CommonProps,
  CssTextAlign,
  IconInput,
  LogicType,
} from '../../../_type';
import { useLabel } from './use-label';

export type LabelEmitter = {
  (eventName: 'change', payload: any): void;
};

export type LabelApi = ReturnType<typeof useLabel>;

export type LabelState = {
  text?: string;
  icon?: IconInput;
  tip?: string;
};

export type LabelIconFor =
  | 'clear'
  | 'copy'
  | 'copy-raw'
  | ((label: LabelApi) => void);

export type LabelProps = CommonProps &
  PlaceholderProps &
  ValuePipeProps &
  DictProps &
  DisplayTextProps & {
    value?: any;

    type?: LogicType;
    textAlign?: CssTextAlign;
    clickable?: boolean;
    nowrap?: boolean;
    disable?: boolean;

    /**
     * 如果开启这个开关, 只要定义了字典，且 mustInOptions
     * 那么将自动根据选项设置前缀图标
     */
    autoPrefixIcon?: boolean;

    /**
     * 前缀图标
     */
    prefixIcon?: IconInput | null;
    prefixHoverIcon?: IconInput | null;
    /**
     * 声明了这个动作，则表示这个图标可以点击
     */
    prefixIconFor?: LabelIconFor;

    /**
     * 后缀图标
     */
    suffixIcon?: IconInput | null;
    suffixHoverIcon?: IconInput | null;
    /**
     * 声明了这个动作，则表示这个图标可以点击
     */
    suffixIconFor?: LabelIconFor;
  };
