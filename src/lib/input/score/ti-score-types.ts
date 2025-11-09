import { CommonProps } from "../../../_type";

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
  starts?: number;

  /**
   * 展示值时是否允许半星: 默认为 true
   */
  allowHalfStart?: boolean;
};
