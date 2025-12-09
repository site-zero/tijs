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
    | 'defaultFieldTypeTransformOptions'
    | 'defaultFieldTypeSerializeOptions'
    | 'defaultComType'
    | 'defaultComConf'
    | 'maxFieldNameWidth'
    | 'fieldLayoutMode'
    | 'changeMode'
    | 'vars'
  > & {
    value?: Vars;
    ignoreNil?: boolean;
  };
