import { OptionsProps } from 'src/lib/_features';
import { CommonProps, TableRowID } from '../../../core';

export type SwitcherProps = CommonProps &
  Omit<OptionsProps, 'mustInOptions'> & {
    multi?: boolean;

    /**
     * 值，如果多选就是数组，如果单选就是单个值
     */
    value?: TableRowID | TableRowID[];
  };
