import {
  AspectSize,
  CommonProps,
  CssBorderStyle,
  IconInput,
  LogicType,
  Vars,
} from '../../../_type';
import {
  ActionBarProps,
  LabelAspectProps,
  PlaceholderProps,
  ValueTranslatorProps,
} from '../../../lib';

/**
 * 标题翻译器，这个转换器使用的场景是当 value 是 `Vars` 的时候，
 * 就需要循环对象的每个字段，通过键，如果可以获取一个转换器
 *
 * @param text - 输入的文本
 * @return `[string, string[]]` 元组 [本字段的标题, 吃掉的的值的字段]
 */
export type TagNameTranslator = (name: string) => [string, string[]];
export type TagNameInfo = {
  title: string;
  name: string | string[];
};

export type TagsEmitter = {
  // 对于 TagItem[] 型的 value
  (event: 'click-tag', payload: TagItem): void;
  // 对于 TagItem[] 型的 value
  (event: 'remove', payload: TagItem): void;
  // 对于 Vars 型的 value
  (event: 'change', payload: Vars): void;
  // 支持排序
  (event: 'sorted', payload: TagItem[]): void;
};

export type TagItem = {
  icon?: IconInput;
  text?: string;
  tip?: string;
  type?: LogicType;
  className?: any;
  value: any;
  /**
   * 我们支持通过 props.value:Vars 来渲染标签列表。
   *
   * 那么每个 tag 都需要一个 name 来从输入的对象里获取值
   */
  name?: string;
};

export type TagsProps = CommonProps &
  PlaceholderProps &
  ValueTranslatorProps & {
    value?: TagItem[] | Vars;

    defaultTagType?: LogicType;
    defaultTagClass?: any;
    defaultTagStyle?: Vars;
    defaultTagAspect?: LabelAspectProps;

    actions?: ActionBarProps;

    /**
     * 前缀标题
     */
    title?: string;

    /**
     * 强制不换行
     */
    nowrap?: boolean;

    /**
     * 可以支持移除操作
     */
    editable?: boolean;

    /**
     * 每个标签支持点击
     */
    tagClickable?: boolean;

    /**
     * 根据对象字段，可以获取一个转换逻辑，以便知道:
     *
     * 1. 这个字段的标题是什么?
     * 2. 这个字段有哪些关联的字段?
     *
     * 记录的键，如果是 `*` 表示针对所有的字段
     */
    nameTranslator?: Record<string, string | TagNameInfo | TagNameTranslator>;

    //--------------------------------------------------
    // Aspect
    //--------------------------------------------------
    /**
     * 整体显示框
     */
    showBoreder?: CssBorderStyle;

    boxFontSize?: AspectSize;
    boxPadding?: AspectSize;
    boxRadius?: AspectSize | 'none';
  };
