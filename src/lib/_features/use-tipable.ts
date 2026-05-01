import _ from "lodash";
import { computed, ref } from "vue";
import { getAppTipsApi, TipBoxProps } from "../_tipbox";

export type TipableProps = Omit<TipBoxProps, "content">;

export type TipableApi = ReturnType<typeof useTipable>;

/**
 * 为组件添加提示功能
 *
 * @param props
 */
export function useTipable() {
  //-----------------------------------------------------
  const _tipApi = getAppTipsApi();
  const _tip_id = ref<number>();
  //-----------------------------------------------------
  const TipDataConfig = computed(() => {
    if (_.isNumber(_tip_id.value)) {
      return {
        "data-tip": `::${_tip_id.value}`,
      };
    }
  });
  //-----------------------------------------------------
  function registerTip(
    tipContent: string | null | undefined,
    tipConifg: TipableProps = {}
  ) {
    // 注销
    if (!tipContent) {
      deposeTip();
      return;
    }
    // 替换
    if (_.isNumber(_tip_id.value)) {
      _tipApi.replaceTip(_tip_id.value, {
        ...tipConifg,
        content: tipContent,
      });
      return;
    }
    // 注册
    else {
      let id = _tipApi.addTip({
        ...tipConifg,
        content: tipContent,
      });
      _tip_id.value = id;
    }
  }
  //-----------------------------------------------------
  function deposeTip() {
    if (_.isNil(_tip_id.value)) return;
    _tipApi.removeTip(_tip_id.value);
    _tip_id.value = undefined;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    TipDataConfig,
    registerTip,
    deposeTip,
  };
}
