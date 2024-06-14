import { CommonProps, Vars } from '../../../core';

export type FilterValue = Vars;

export type FilterProps = CommonProps & {
  value?: FilterValue;
};
