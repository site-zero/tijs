import { IconInput } from "@site0/tijs";
import { BoxIconFor } from "./types-box-icon";

export type BoxPrefixSuffixProps = {
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
