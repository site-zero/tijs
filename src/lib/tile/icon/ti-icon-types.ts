import { CommonProps, IconInput, Vars } from '../../../_type';
import { TiColor, TiDict } from '../../../core';

export interface IconProps extends CommonProps {
  //
  // Data
  //
  value?: IconInput;
  base?: string;
  dict?: TiDict;
  defaultValue?: IconInput;
  tip?: string;
  //
  // Behavior
  //
  notifyName?: string;
  notifyConf?: any;
  stopPropagation?: boolean;
  //
  // Aspect
  //
  width?: number | string;
  height?: number | string;
  opacity?: number;
  // font only
  fontSize?: number | string;
  color?: string | TiColor;
  // image only
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  // Free Style
  style?: Vars;
  imgStyle?: Vars;
  fontStyle?: Vars;
}
