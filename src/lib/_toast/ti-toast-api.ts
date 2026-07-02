import _ from "lodash";
import { computed, ref } from "vue";
import { toLogicColor, Vars } from "../../_type";
import { CssUtils } from "../../core";
import { useFieldCom } from "../_features";
import { ToastBoxProps } from "./ti-toast-types";

export function useToastApi(props: ToastBoxProps) {
  const _fcom = useFieldCom(props);
  const _isdead = ref(false);
  const _pined = ref(false);
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const isDead = computed(() => _isdead.value);
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return `speed-${props.tranSpeed || "normal"}`;
  });
  //-----------------------------------------------------
  const TransBoxClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      `origin-${props.position}`,
      `is-${props.type}`,
      {
        "is-dead": _isdead.value,
        "is-pined": _pined.value,
      }
    )
  );
  //-----------------------------------------------------
  const TransBoxStyle = computed(() => {
    const logicType = props.type;
    let cl = toLogicColor(logicType);
    let bg = toLogicColor(logicType, "r");
    let bb = toLogicColor(logicType, "b");
    let css: Vars = props.reverseColor
      ? { "--color": bg, "--bg": cl, "--border": bb }
      : { "--color": cl, "--bg": bg, "--border": bb };
    _.assign(css, props.style);
    return css;
  });
  //-----------------------------------------------------
  const ToastCom = computed(() => {
    return _fcom.autoGetCom(
      {},
      {
        content: props.content,
        contentType: props.contentType,
      },
      props.content
    );
  });
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function markReady() {
    _isdead.value = false;
  }
  //-----------------------------------------------------
  function setPined(pined: boolean) {
    _pined.value = pined;
    if (!pined) {
      deferCloseToast();
    }
  }
  //-----------------------------------------------------
  function togglePined() {
    setPined(!_pined.value);
  }
  //-----------------------------------------------------
  function closeToast(force = false) {
    if (_pined.value && !force) {
      return;
    }
    _isdead.value = true;
    // 等动画播放完毕了，才真正的移除 dom
    _.delay(() => {
      props.releaseDom();
    }, 500);
  }
  //-----------------------------------------------------
  function deferCloseToast() {
    if (props.duration && props.duration > 0) {
      _.delay(() => {
        closeToast();
      }, props.duration * 1000);
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    isDead,
    TopClass,
    TransBoxClass,
    TransBoxStyle,
    ToastCom,
    markReady,
    setPined,
    togglePined,
    closeToast,
    deferCloseToast,
  };
}
