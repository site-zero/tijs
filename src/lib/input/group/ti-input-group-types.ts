import { CommonProps, Vars } from "../../../_type";
import { GridFieldsProps } from "../../shelf/all-shelf";

export type InputGroupProps = CommonProps &
  Pick<
    GridFieldsProps,
    | "style"
    | "fields"
    | "bodyPartStyle"
    | "bodyPartFontSize"
    | "bodyPartGap"
    | "layoutGridTracks"
    | "defaultFieldType"
    | "defaultFieldTypeTransformOptions"
    | "defaultFieldTypeSerializeOptions"
    | "defaultComType"
    | "defaultComConf"
    | "maxFieldNameWidth"
    | "fieldLayoutMode"
    | "changeMode"
    | "vars"
  > & {
    value?: Vars;

    /**
     * 如果将 changeMode="all" 那么子对象修改后，是否自动过滤空键值
     */
    ignoreNil?: boolean;

    /**
     * 注册的字段集，不指定，则采用默认字段集
     */
    fieldSetName?: string;

    /**
     * 字段名称部分如何显示:
     *
     * 1. dft-placeholder: 字段名称作为默认 placeholder 「默认」
     * 2. placeholder: 字段名称作为 placeholder
     * 3. sep: 字段名称作为分隔符，默认为 `-` （第一个控件将不显示）
     * 4. title: 字段名称依然显示标题（第一个控件将不显示）
     */
    fieldTitleAs?: "dft-placeholder" | "placeholder" | "sep" | "title";

    /**
     * 字段分隔符，默认为 `-`。
     * 只有在 fieldTitleAs = "sep|placeholder" 时有效。
     */
    fieldSeparator?: string | null | undefined;
  };
