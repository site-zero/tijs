import { IconInput } from '../../';

export const COM_TYPE = 'TiCheck';

export type CheckProps = {
  value: any;
  text?: string;
  // [falseIcon, trueIcon]
  icons?: [IconInput, IconInput];
  // [falseText, trueText]
  values?: [any, any];
  isTrue?: (val: any) => boolean;
};
