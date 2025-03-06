import {
  AspectSize,
  CommonProps,
  CssAlignment,
  IconInput,
  LogicType,
  Vars,
} from '../../../_type';
import {
  DictProps,
  DisplayTextProps,
  PlaceholderProps,
  ReadonlyProps,
  ValuePipeProps,
} from '../../_features';
import { ListProps } from '../../view/all-views';
import { useInputBox2 } from './use-input-box2';
import { ItemLookupProps } from './use-item-lookup';
import { ValueHintCookingProps } from './use-value-hint-cooking';
import { ValueOptionsProps } from './use-value-options';
//--------------------------------------------------
export type InputBoxEmitter = {
  (event: 'change', value: any): void;
  (event: 'blur'): void;
  (event: 'focus'): void;
};
//--------------------------------------------------
export type InputBoxAspect = {
  /**
   * 隐藏输入框边框
   */
  hideBorder?: boolean;

  style?: Vars;
  inputStyle?: Vars;
  partMainStyle?: Vars;
  mainBodyStyle?: Vars;
  align?: CssAlignment;
  boxFontSize?: AspectSize;
  boxPadding?: AspectSize;
  boxRadius?: AspectSize | 'none';
  type?: LogicType;
  width?: string;
};
//--------------------------------------------------
export type InputBoxProps = CommonProps &
  ValuePipeProps &
  DictProps &
  ValueOptionsProps &
  ValueHintCookingProps &
  ItemLookupProps &
  PlaceholderProps &
  InputBoxAspect &
  ReadonlyProps &
  DisplayTextProps & {
    /**
     * 输入值
     */
    value?: any;

    autoI18n?: boolean;

    emitType?: BoxEmitType;

    emitTime?: BoxEmitTime[];

    /**
     * 传递输入框 api 给父控件。
     * 每次 api 因为自动计算而导致的变化，都会触发这个回调
     *
     * @param box 输入框 api
     */
    exportApi?: (box: InputBoxApi) => void;

    /**
     * 提示列表的配置
     */
    tipShowTime?: TipShowTime;

    /**
     * 延迟多少毫秒（反弹跳）才查询提示信息，默认 500ms
     */
    tipShowDelay?: number;

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
     * 展出提示框宽度，如果不声明，则采用与 box 相同的宽度
     */
    tipListWidth?: string;

    /**
     * 展出提示框最小宽度，如果不声明，则采用与 box 相同的宽度
     */
    tipListMinWidth?: string;

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
     *
     * TODO 似乎没用了，可以删除
     */
    useTextWhenFocus?: boolean;

    // 输入框，是否允许用户输入
    canInput?: boolean;

    /**
     * 是否要在选项的首部，增加一个【清除】 的选项
     */
    showCleanOption?: boolean;

    /**
     * 如果开启这个开关, 只要定义了字典，且 mustInOptions
     * 那么将自动根据选项设置前缀图标
     */
    autoPrefixIcon?: boolean;

    /**
     * 前缀图标
     */
    prefixIcon?: IconInput | null;
    prefixHoverIcon?: IconInput | null;
    /**
     * 声明了这个动作，则表示这个图标可以点击
     */
    prefixIconFor?: BoxIconFor;

    /**
     * 后缀图标
     */
    suffixIcon?: IconInput | null;
    suffixHoverIcon?: IconInput | null;
    /**
     * 声明了这个动作，则表示这个图标可以点击
     */
    suffixIconFor?: BoxIconFor;
  };
//--------------------------------------------------
/**
 * 通知改动时候采用什么值
 *
 * - `value` : 普通值
 * - `std-item` : 整体标准对象
 * - `raw-item` : 整体原始对象
 */
export type BoxEmitType = 'value' | 'std-item' | 'raw-item';
//--------------------------------------------------
/**
 * 除非一些必要的时机，还有哪些时候需要检查改动
 *
 * - blur : 默认的 blur 是，如果没有展开选项，才会检查更新，明确声明 blur 则表示肯定要检查更新
 * - close : 选项框关闭时候检查更新
 */
export type BoxEmitTime = 'blur' | 'close';
//--------------------------------------------------
export type BoxIconFor =
  | 'copy'
  | 'load-options'
  | 'clear'
  | ((box: InputBoxApi) => void);
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
//--------------------------------------------------
export type InputBoxApi = ReturnType<typeof useInputBox2>;
