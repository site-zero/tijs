import { ImageProps } from 'index';
import { CommonProps } from '../../../_type';
import { ProgressBarProps } from '../progress-bar/ti-progress-bar-types';

export type ThumbProps = CommonProps & {
  preview?: ImageProps;
  progress?: ProgressBarProps;
};
