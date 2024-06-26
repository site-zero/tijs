import { CommonProps, Vars } from '../../../_type';
import { GridFieldsProps } from '../../shelf/all-shelf';

export type InputGroupProps = CommonProps &
  Pick<
    GridFieldsProps,
    | 'style'
    | 'fields'
    | 'bodyPartStyle'
    | 'bodyPartFontSize'
    | 'bodyPartGap'
    | 'layoutGridTracks'
    | 'defaultFieldType'
    | 'defaultComType'
    | 'defaultComConf'
    | 'maxFieldNameWidth'
    | 'fieldLayoutMode'
  > & {
    value?: Vars;
    ignoreNil?: boolean;
  };
