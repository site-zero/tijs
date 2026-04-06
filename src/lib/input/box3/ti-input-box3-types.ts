import {
  CommonProps,
  DictProps,
  DisplayTextProps,
  PlaceholderProps,
  ReadonlyProps,
  ValuePipeProps,
} from "@site0/tijs";
import {
  BoxAspectProps,
  BoxCompositionProps,
  BoxHintCookingProps,
  BoxIconEmit,
  BoxOptionsDataProps,
  BoxPrefixSuffixProps,
} from "./_fea";
import { useTiInputBox3Api } from "./use-ti-input-box3-api";

export type InputBox3Emitter = {
  (event: "change", value: any): void;
  (event: "blur"): void;
  (event: "focus"): void;
  // (event: "click:prefix-icon"): void;
  // (event: "click:suffix-icon"): void;
  (event: BoxIconEmit): void;
  (event: "click", payload: any): void;
};

/**
 * 通知改动时候采用什么值
 *
 * - `value` : 普通值
 * - `std-item` : 整体标准对象
 * - `raw-item` : 整体原始对象
 */
export type Box3EmitType = "value" | "std-item" | "raw-item";

/**
 * 提示框的显示时机
 *
 * - focus : 聚焦就显示
 * - auto  : 只有需要才显示
 */
export type Box3OptionsShowTime = "focus" | "auto";

/**
 * 对于提示列表的快速格式模式，
 *
 * - `T`   : `<em>${text}</em>`
 * - `VT`  : `<code>${value}</code><em>${text}</em>`
 * - `TV`  : `<em>${text}</em><code>${value}</code>`
 * - `TP`  : `<em>${text}</em><abbr>${tip}</abbr>`
 * - `PT`  : `<code>${tip}</code><em>${text}</em>`
 * - `VTP` : `<code>${value}</code><em>${text}</em><abbr>${tip}</abbr>`
 * - `VpT` : `<code>${value}(${tip})</code><em>${text}</em>`
 *
 * 在没有声明  tipList.textFormat 的前提下，它可以为其快速设置格式化方式
 */
export type Box3OptionFormat = "T" | "VT" | "TV" | "VTP" | "TP" | "PT" | "VpT";

export type InputBox3Props = CommonProps &
  BoxCompositionProps &
  DictProps &
  DisplayTextProps &
  BoxAspectProps &
  PlaceholderProps &
  ReadonlyProps &
  BoxOptionsDataProps &
  BoxHintCookingProps &
  ValuePipeProps &
  BoxPrefixSuffixProps & {
    /**
     * 输入值
     */
    value?: any;
    /**
     * 如果值为空字符串，那么默认的会给 null
     * 但是有时候，我们还是想区分出空串与 null
     * 打开这个选项即可
     */
    keepEmptyValue?: boolean;

    autoI18n?: boolean;

    emitType?: Box3EmitType;
  };

export type InputBox3Api = ReturnType<typeof useTiInputBox3Api>;
