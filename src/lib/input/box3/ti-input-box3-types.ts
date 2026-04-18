import {
  BoxDropListProps,
  BoxValueProps,
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

export type InputBoxEmitter = {
  (event: "change", value: any): void;
  (event: "blur"): void;
  (event: "focus"): void;
  // (event: "click:prefix-icon"): void;
  // (event: "click:suffix-icon"): void;
  (event: BoxIconEmit): void;
  (event: "click", payload: any): void;
};

export type BoxOptionsStatus = "loading" | "ready" | "hide";

/**
 * 提示框的显示时机
 *
 * - focus : 聚焦就显示
 * - auto  : 只有需要才显示
 * - Box3OptionsShowTimeTester : 自定义测试函数
 */
export type BoxOptionsShowTime = "focus" | "auto" | BoxOptionsShowTimeTester;

export type BoxOptionsShowTimeTester = (input: string) => boolean;

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
export type BoxOptionFormat = "T" | "VT" | "TV" | "VTP" | "TP" | "PT" | "VpT";

export type InputBoxProps = CommonProps &
  BoxCompositionProps &
  DictProps &
  DisplayTextProps &
  PlaceholderProps &
  ReadonlyProps &
  BoxAspectProps &
  BoxOptionsDataProps &
  BoxDropListProps &
  BoxHintCookingProps &
  ValuePipeProps &
  BoxPrefixSuffixProps &
  BoxValueProps & {
    /**
     * 如果值为空字符串，那么默认的会给 null
     * 但是有时候，我们还是想区分出空串与 null
     * 打开这个选项即可
     */
    keepEmptyValue?: boolean;

    /**
     * 提示列表的配置
     */
    tipShowTime?: BoxOptionsShowTime;

    /**
     * 延迟多少毫秒（反弹跳）才查询提示信息，默认 500ms
     * 同样，这个设置，也会影响 pipe 的应用反弹跳阈值
     */
    tipShowDelay?: number;

    /**
     * 当 focus 自动聚焦 Input 框
     */
    autoSelect?: boolean;

    /**
     * 当创建的时候，自动 focus 控件
     */
    autoFocus?: boolean;

    /**
     * 默认的，当输入框聚焦，且输入框不是只读还且是可输入的状态
     * 输入框会自动将内容变成原始值。因为这个框本来就代表着原始值。
     *
     * 某些时候，你并不想要这种行为，则可以打开这个选项。
     * 这意味着，即使聚焦的时候，可编辑的输入框也会显示翻译后的文本。
     *
     * 实用场景譬如： TiInputCode，处于 `[text][tip]` 模式下，我们总想
     * 让输入框显示有意义的便于人类阅读的文字，因为我们可能用 text 表示
     * 一个记录的唯一值，而真正存储是这个记录的UUID主键。我们当然不想
     * 让用户聚焦输入框就显示可怕的 UUID，这会让很多初级用户产生不舒适甚至恐慌
     */
    useTextWhenFocus?: boolean;

    showDebugInfo?: boolean;
  };

export type InputBoxApi = ReturnType<typeof useTiInputBox3Api>;
