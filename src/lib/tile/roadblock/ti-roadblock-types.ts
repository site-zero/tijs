import { CommonProps, Link } from '../../../_type';
import { IconTextProps } from '../../_features';

export type RoadblockMode = 'cover' | 'fit' | 'auto';
export type RoadblockLayout = 'A' | 'B';
export type RoadblockSize = 'small' | 'normal' | 'big' | 'large';
export type RoadblockOpacity = 'faint' | 'shadowy' | number;
export type RoadblockLink = Link;

export type RoadblockProps = CommonProps &
  IconTextProps & {
    mode?: RoadblockMode;
    layout?: RoadblockLayout;
    size?: RoadblockSize;
    opacity?: RoadblockOpacity;
    links?: RoadblockLink[];
  };
