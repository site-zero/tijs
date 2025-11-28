import { computed } from "vue";
import { Num, Rects, ScoreEmitter, ScoreProps, ScoreStarType } from "../../..";

export type ScoreApi = ReturnType<typeof useScoreApi>;

export function useScoreApi(
  props: ScoreProps,
  getUl: () => HTMLElement | null | undefined,
  emit: ScoreEmitter
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
    console.log(_index, _event)
    // 最大星数
    let { stars = 5, minValue = 0, maxValue = 10 } = props;

    // 获取全星星数(就是下标)
    let n = _index

    // 看看点击区域
    // 获取点击元素的中点
    let $ul = getUl();
    let $li = $ul?.children[_index];
    let rect = Rects.createBy($li!);
    let { pageX } = _event
    // 左侧，半星
    if (pageX < rect.x) {
      n += 0.5;
    }
    // 右侧全星
    else {
      n += 1;
    }

    // 切换为比值
    let p = Math.min(1, n / stars)

    // 转换为值
    let v = Math.max(minValue, p * maxValue);

    // 原来就是1星，再点击则归零
    if (Starts.value.full == 1 && Starts.value.half < 0 && _index == 0) {
      if (n <= 0.5) {
        emit('change', 0);
        return;
      }
    }

    // 如果不支持半星模式，需要取整
    if (!props.allowHalf) {
      v = Math.round(v);
    }
    if (v !== props.value) {
      emit('change', v)
    }
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
