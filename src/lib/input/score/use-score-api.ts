import { computed } from "vue";
import { Num, ScoreProps, ScoreStarType } from "../../..";

export type ScoreApi = ReturnType<typeof useScoreApi>;

export function useScoreApi(
  props: ScoreProps,
  _getUl: () => HTMLElement | null | undefined
) {
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  /**
   * 计算分数值的百分比表示
   * 将实际分数值转换为相对于最大值的比例（0到1之间的值）
   * 如果当前值超过最大值，则返回1（100%）
   * @returns 分数的百分比值（0-1之间的小数）
   */
  const PercentValue = computed(() => {
    let { value = 0, maxValue = 10 } = props;
    // 确保返回值不超过1
    if (maxValue < value) {
      return 1;
    }
    // 计算并返回百分比值
    return Num.precise(value / maxValue, 2);
  });
  //-----------------------------------------------------
  const Starts = computed(() => {
    let starts = props.stars ?? 5;
    let list: ScoreStarType[] = Array(starts).fill("empty");
    let val = PercentValue.value;
    let scaledValue = Num.round(val * starts, 3);
    let full = props.allowHalf
      ? Math.floor(scaledValue)
      : Math.round(scaledValue);

    // 处理半星显示逻辑：
    // 如果所有星星都是满的，不需要显示半星，设置为-1
    // 否则，half值等于full值，表示该下标位置需要显示半星
    let half = props.allowHalf && scaledValue > full ? full : -1;

    // 填充满星
    for (let i = 0; i < full; i++) {
      list[i] = "full";
    }

    // 处理半星显示
    if (half !== -1) {
      list[half] = "half";
    }

    return { scaledValue, list, full, half };
  });
  //-----------------------------------------------------
  // 响应操作
  //-----------------------------------------------------
  function onClickStar(_index: number, _event: MouseEvent) {
    // 获取全星星数

    // 如果支持半星模式，需要看看点击区域
    // 获取点击元素的中点

    // 在中点左侧：半星
    // 在中点由侧：全星

  }
  //-----------------------------------------------------
  // 返回 API
  //-----------------------------------------------------
  return {
    // 计算属性
    PercentValue,
    Starts,
    // 响应操作
    onClickStar,
  };
}
