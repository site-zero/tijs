import { ComRef, FieldComProps, IconInput, TextContentType, Vars } from '../../../_type';

export type TextSnippetProps = FieldComProps & {
  /**
   * 控件根元素的标签名称，默认 'DIV'
   */
  tagName?: string;
  /**
   * 生成元素的 className
   */
  className?: any;
  /**
   * 根元素的 css 样式
   */
  style?: Vars;
  /**
   * 文本部分的 css 样式
   */
  textStyle?: Vars;
  /**
   * 根元素的 attribute 表
   */
  attrs?: Vars;
  /**
   * 根元素的 property 表
   */
  props?: Vars;

  /**
   * 元素的文本内容
   */
  text?: string;
  /**
   * 元素的文本类型：
   * - html
   * - text
   */
  textType?: TextContentType;

  /**
   * 对于 text 属性需要自动进行 i18n 多国语言转换
   */
  autoI18n?: boolean;

  // 用来动态 explain 传入的 comConf
  vars?: Vars;

  prefixIcon?: IconInput;
  prefixTip?: string;
  suffixIcon?: IconInput;
  suffixTip?: string;

  ctrlTip?: string;
};
