import { Size2D, toLogicColor, Vars } from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { ShowBoxSizeProps } from "./type-show-box-size";

export type ShowBoxSizeApi = ReturnType<typeof useShowBoxSize>;

export type ShowBoxSizeSetup = {
  isFocused: () => boolean;
  getBoxElement: () => HTMLElement | null;
  getBoxSize: () => number;
};

export function useShowBoxSize(
  props: ShowBoxSizeProps,
  setup: ShowBoxSizeSetup
) {
  const {
    forceShowSizeWhen = "oversize",
    safesizeTipType = "tip",
    oversizeTipType = "danger",
    fullsizeTipType = "star",
  } = props;
  const { isFocused, getBoxElement, getBoxSize } = setup;
  //--------------------------------------------------
  // 数据模型
  //--------------------------------------------------
  const _box_size = ref<Size2D>({ width: 0, height: 0 });
  //--------------------------------------------------
  // 计算属性
  //--------------------------------------------------
  const ShowSizeAt = computed(() => props.showSizeAt ?? "top-right");
  const ShowSizeWhen = computed(() => props.showSizeWhen ?? "auto");
  //--------------------------------------------------
  const isOverSize = computed(() => {
    if (_.isNumber(props.maxSize)) {
      let bxs = getBoxSize();
      return bxs > props.maxSize;
    }
    return false;
  });
  //--------------------------------------------------
  const isFullSize = computed(() => {
    if (_.isNumber(props.maxSize)) {
      let bxs = getBoxSize();
      return bxs == props.maxSize;
    }
    return false;
  });
  //--------------------------------------------------
  const isShowSize = computed(() => {
    const ssw = ShowSizeWhen.value;
    if ("fullsize" == forceShowSizeWhen) {
      if (isFullSize.value) return true;
      if (isOverSize.value) return true;
    }
    if ("oversize" == forceShowSizeWhen) {
      if (isOverSize.value) return true;
    }
    if ("auto" == ssw) {
      if (_.isNumber(props.maxSize)) {
        return isFullSize.value || isOverSize.value || isFocused();
      }
      return false;
    }
    if ("never" == ssw) return false;
    if ("always" == ssw) return true;
    if ("focused" == ssw) return isFocused();
    if ("oversize" == ssw) return isOverSize.value;
    return false;
  });
  //--------------------------------------------------
  const TipClass = computed(() => {
    return {
      "is-oversize": isOverSize.value,
      "is-fullsize": isFullSize.value,
      "is-focused": isFocused(),
    };
  });
  //--------------------------------------------------
  const TipStyle = computed(() => getSizeTipStyle());
  //--------------------------------------------------
  const TipText = computed(() => {
    let bxs = getBoxSize();
    if (props.maxSize) {
      return [bxs, props.maxSize].join("/");
    }
    return bxs;
  });
  //--------------------------------------------------
  // 核心计算
  //--------------------------------------------------
  function updateBoxSize() {
    const box = getBoxElement();
    if (box) {
      const rect = box.getBoundingClientRect();
      _box_size.value = {
        width: rect.width,
        height: rect.height,
      };
    }
  }
  //--------------------------------------------------
  /**
   * 我们假设 Box 有下面的 DOM 结构
   * ```
   * div.ti-input
   * |-- div.part-main
   * |   |-- [slot#head]
   * |   |-- div.main-body  <-- 这里应该有 position:relative
   * |   |   |-- ?div.icon-part.at-prefix
   * |   |   |-- input
   * |   |   |-- ?div.icon-part.at-suffix
   * |   |   |-- ?div.size-part
   * |   |-- [slot#tail]
   * ```
   */
  function getSizeTipStyle() {
    let re = {
      fontFamily: "var(--ti-font-fixed)",
      fontSize: "var(--ti-fontsz-s)",
      padding: "0 0.5em",
      borderRadius: "var(--ti-measure-r-s)",
      lineHeight: "1.6em",
      color: toLogicColor(safesizeTipType),
      backgroundColor: toLogicColor(safesizeTipType, "r"),
    } as Vars;
    const ssa = ShowSizeAt.value;
    let __update_style = {
      "tail": () => {
        _.assign(re, {
          "align-self": "flex-end",
          "margin": "var(--ti-gap-t)",
        });
      },
      "top-right": () => {
        _.assign(re, {
          position: "absolute",
          right: 0,
          bottom: `${_box_size.value.height}px`,
        });
      },
      "top-left": () => {
        _.assign(re, {
          position: "absolute",
          left: 0,
          bottom: `${_box_size.value.height}px`,
        });
      },
      "bottom-right": () => {
        _.assign(re, {
          position: "absolute",
          right: 0,
          top: `${_box_size.value.height}px`,
        });
      },
      "bottom-left": () => {
        _.assign(re, {
          position: "absolute",
          left: 0,
          top: `${_box_size.value.height}px`,
        });
      },
    }[ssa];

    // 标记显示样式
    if (isOverSize.value) {
      _.assign(re, {
        color: toLogicColor(oversizeTipType),
        backgroundColor: toLogicColor(oversizeTipType, "r"),
      });
    } else if (isFullSize.value) {
      _.assign(re, {
        color: toLogicColor(fullsizeTipType),
        backgroundColor: toLogicColor(fullsizeTipType, "r"),
      });
    }

    if (__update_style) {
      __update_style();
    }
    return re;
  }
  //--------------------------------------------------
  // 返回接口
  //--------------------------------------------------
  return {
    TipClass,
    TipStyle,
    TipText,
    isShowSize,
    isOverSize,
    updateBoxSize,
  };
}
