import { AnyOptionItem, Convertor, IconInput } from "@site0/tijs";
import { BoxIconFor } from "./types-box-icon";

export type BoxPrefixSuffixProps<A> = {
  /**
   * 如果 prefix/suffix Icon 被指定为打开链接，
   * 那么这个选项将被用来生成链接。
   *
   * 它有下面两种形式:
   *
   * 1. string: 就是一个字符串模板，输出为链接
   * 2. Convertor: 就是一个转换函数，`(ctx)=>string` 输出为链接
   *
   * **其中上下文对象为：**
   *
   * - 没有 options data 的时候，上下文是 {value:props.value}
   * - 有 options data 的时候，上下文就是 option item 的裸值
   *
   * 如果不定义本选项，则 props.value 将被作为链接。
   */
  openLink?: string | Convertor<AnyOptionItem, string>;

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
  prefixIconFor?: BoxIconFor<A>;

  /**
   * 后缀图标
   */
  suffixIcon?: IconInput | null;
  suffixHoverIcon?: IconInput | null;
  /**
   * 声明了这个动作，则表示这个图标可以点击
   */
  suffixIconFor?: BoxIconFor<A>;
};
