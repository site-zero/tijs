import { CommonProps, StrOptionItem } from '../../../core';
import { PlaceholderProps, ValueTranslatorProps } from '../../../lib';

export type TagsProps = CommonProps &
  PlaceholderProps &
  ValueTranslatorProps & {
    value?: StrOptionItem[];
  };
