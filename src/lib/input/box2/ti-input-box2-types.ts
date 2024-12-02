import {
  AnyOptionItem,
  AspectSize,
  CommonProps,
  CssAlignment,
  Vars,
} from '../../../_type';
import { PlaceholderProps } from '../../_features';
import { ListProps } from '../../view/all-views';
import { BoxTipsProps } from './use-box-tips';
import { DictInput, DictProps } from './use-dict';
import { ItemLookupProps } from './use-item-lookup';
import { ValueHintCookingProps } from './use-value-hint-cooking';
import { ValueOptionsProps } from './use-value-options';
import { ValuePipeProps } from './use-value-pipe';

//--------------------------------------------------
export type InputBox2Emitter = {
  (event: 'change', value: any): void;
  (event: 'box-item-change', payload: AnyOptionItem | undefined): void;
};
//--------------------------------------------------
export type InputBox2Props = CommonProps &
  ValuePipeProps &
  DictProps &
  ValueOptionsProps &
  ValueHintCookingProps &
  ItemLookupProps &
  Omit<BoxTipsProps, 'getElement' | 'tipBoxVisible' | 'hideBoxTip'> &
  PlaceholderProps & {
    /**
     * 输入值
     */
    value?: any;

    options?: DictInput;

    autoI18n?: boolean;

    /**
     * 隐藏输入框边框
     */
    hideBorder?: boolean;

    style?: Vars;
    inputStyle?: Vars;
    align?: CssAlignment;
    boxSize?: AspectSize;
    boxPadding?: AspectSize;
    boxRadius?: AspectSize;

    /**
     * 提示列表的配置
     */
    tipShowTime?: TipShowTime;

    /**
     * 提示信息的格式
     */
    tipFormat?: TipOptionFormat;

    // 查询提示信息的时候，采用输入的值
    // 默认 false
    tipUseHint?: boolean;

    /**
     * 提示列表的配置
     */
    tipList?: Omit<ListProps, 'data'>;

    /**
     * 当 focus 自动聚焦 Input 框
     */
    autoSelect?: boolean;

    /**
     * 如果开启这个开关, 只要定义了字典，且 mustInOptions
     * 那么将自动根据选项设置前缀图标
     */
    autoPrefixIcon?: boolean;

    /**
     * 如果值是某个选项，默认的会在输入框显示选项的文字而不是值。
     * 开启这个选项，则在输入框直接显示值而不是翻译后的文字
     */
    useRawValue?: boolean;

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

    // 输入框，是否允许用户输入
    canInput?: boolean;

    /**
     * 是否要在选项的首部，增加一个【清除】 的选项
     */
    showCleanOption?: boolean;

    // 前缀按钮用来删除
    prefixIconForClean?: boolean;

    // 后缀按钮用来复制
    suffixIconForCopy?: boolean;
  };
//--------------------------------------------------
/**
 * 提示框的显示时机
 *
 * - focus : 聚焦就显示
 * - auto  : 只有需要才显示
 */
export type TipShowTime = 'focus' | 'auto';
/**
 * 对于提示列表的快速格式模式，
 *
 * - `T`   : `<em>${text}</em>`
 * - `VT`  : `<code>${value}</code><em>${text}</em>`
 * - `TV`  : `<em>${text}</em><code>${value}</code>`
 * - `Tt`  : `<em>${text}</em><span>${tip}</span>`
 * - `VTt` : `<code>${value}</code><em>${text}</em><span>${tip}</span>`
 *
 * 在没有声明  tipList.textFormat 的前提下，它可以为其快速设置格式化方式
 */
export type TipOptionFormat = 'T' | 'VT' | 'TV' | 'VTT' | 'TT';
