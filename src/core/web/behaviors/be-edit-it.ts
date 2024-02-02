import { Callback3, DomSelector } from "../../";

export type EditItOptions = Partial<{
  /**
   * 是否是多行文本
   *
   * @default `false`
   */
  multi: boolean;
  /**
   * 多行文本下，回车是否表示确认。
   * 如果回车表示确认，那么 `CTRL`+回车则表示换行
   *
   * @default `false`
   */
  enterAsConfirm: boolean;
  /**
   * 多行文本上，输出的值新行用 BR 替换。
   *
   * @default `false`
   */
  newLineAsBr: boolean;
  /**
   * 初始文字，如果没有给定，采用 Element 的文本
   */
  text: string;
  /**
   * 是否自动去掉前后空白
   *
   * @default `true``
   */
  trim: boolean;
  /**
   * 指定宽度，没有指定(小于等于0)则默认采用宿主元素的宽度
   */
  width: number;
  /**
   * 指定高度，没有指定(小于等于0)则默认采用宿主元素的高度
   */
  height: number;
  /**
   * 自动延伸宽度。
   * 主要是普通单行模式，随着输入内容变多，输入框也自动延长
   *
   * @default `true`
   */
  extendWidth: boolean;
  /**
   * 自动延伸高度
   * 主要是多行文本模式下有用，随着输入内容的换行
   * 文本框也自动变高
   *
   * @default `true`
   */
  extendHeight: boolean;

  /**
   * 当显示输入框，是否全选文字（仅当非 multi 模式有效）
   *
   * @default `true`
   */
  selectOnFocus: boolean;

  // 修改之后的回调
  // 如果不指定这个项，默认实现是修改元素的 innertText
  after: Callback3<string, string, HTMLElement>;
}>;

export function EditIt(_it: DomSelector, _options = {} as EditItOptions): void {
  // let {
  //   multi = false,
  //   enterAsConfirm = false,
  //   newLineAsBr = false,
  //   text,
  //   trim = false,
  //   width = 0,
  //   height = 0,
  //   extendWidth = true,
  //   extendHeight = true,
  //   selectOnFocus = true,
  //   after
  // } = options;
  // throw "No Implement!!!";
}
