import {
  AspectSizeInput,
  CommonProps,
  LogicColorSuffix,
  LogicType,
  Vars,
} from "../../../_type";

export type ScoreEmitter = {
  (event: "change", value: number): void;
};

export type ScoreProps = CommonProps & {
  /**
   * 分数的当前值: 默认为 0
   * 不能大于 maxValue 或小于 minValue
   */
  value?: number;

  /**
   * 分数的最小值: 默认为 0
   */
  minValue?: number;

  /**
   * 分数的最大值: 默认为 10
   */
  maxValue?: number;

  /**
   * 用几颗星表示满分: 默认为 5
   */
  stars?: number;

  /**
   * 展示值时是否允许半星: 默认为 true
   */
  allowHalf?: boolean;

  //-----------------------------------------------------
  // Aspect
  //-----------------------------------------------------
  starFontSize?: AspectSizeInput;
  starGap?: AspectSizeInput;
  starItemPadding?: AspectSizeInput;
  starColorType?: LogicType;
  starColorSuffix?: LogicColorSuffix | null;

  starStyle?: Vars;
  starIconStyle?: Vars;
};

export type ScoreStarType = "full" | "half" | "empty";

export type ScoreStars = {
  /**
   * 被 props.stars 放大后的数量
   */
  startValue: number;
  /**
   * 有几颗满星
   */
  full: number;

  /**
   * 第几颗是半星
   */
  half: number;

  /**
   * 星星的展示列表
   */
  list: ScoreStarType[];
};
