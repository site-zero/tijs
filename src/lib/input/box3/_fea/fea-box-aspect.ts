import { CssUtils, getDockingStyle, Rect, Rects } from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { BoxAspectProps } from "./types-box-aspect";

export type FeaBoxAspectSetup = {
  isFocused: () => boolean;
  isTipBoxReady: () => boolean;
  isReadonly: () => boolean;
  getElement: () => HTMLElement | null;
  getDockingElement: () => HTMLElement | null;
};

export function feaBoxAspect(
  props: BoxAspectProps,
  options: FeaBoxAspectSetup
) {
  const {
    isFocused,
    isTipBoxReady,
    isReadonly,
    getElement,
    getDockingElement,
  } = options;
  //--------------------------------------------------
  const _box_rect = ref<Rect>();
  //--------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //--------------------------------------------------
  const TopStyle = computed(() => makeBoxAspectStyle(props));
  //--------------------------------------------------
  const PartMainClass = computed(() => {
    return {
      "is-focused": isFocused(),
      "show-tips": isTipBoxReady(),
      "is-readonly": isReadonly(),
    };
  });
  //--------------------------------------------------
  const PartMainStyle = computed(() => {
    let re = _.assign(props.partMainStyle, {
      width: _box_rect.value?.width,
      height: _box_rect.value?.height,
    });
    return CssUtils.toStyle(re);
  });
  //--------------------------------------------------
  const MainBodyStyle = computed(() => {
    let re = _.assign({}, props.mainBodyStyle);
    if (props.hideBorder) {
      re.border = "0px";
      re.borderRadius = "0px";
    }
    return CssUtils.toStyle(re);
  });
  //--------------------------------------------------
  const InputStyle = computed(() => {
    return CssUtils.toStyle(props.inputStyle);
  });
  //--------------------------------------------------
  const BoxBraceStyle = computed(() => {
    let $el = getElement();
    if (!$el) {
      return {};
    }
    if (!isTipBoxReady()) {
      _box_rect.value = undefined;
      return;
    }
    _box_rect.value = Rects.createBy($el);
    return CssUtils.toStyle({
      width: _box_rect.value.width,
      height: _box_rect.value.height,
      background: "red",
    });
  });
  //--------------------------------------------------
  const BoxTipWrapperStyle = computed(() => {
    let $src = getElement();
    let $con = getDockingElement();
    if (!$src || !$con) {
      return {};
    }
    let box = Rects.createBy($src);
    if (!$src || !box) {
      return {};
    }
    return getDockingStyle(getTipBoxDockStyle(box), $src, box);
  });
  //--------------------------------------------------
  // 帮助函数
  //--------------------------------------------------
  function getTipBoxDockStyle(box: Rect) {
    let boxWidth = `${box.width}px`;
    let minWidth = boxWidth;
    if (props.tipListMinWidth) {
      minWidth = `max(${props.tipListMinWidth}, ${boxWidth})`;
    }
    return {
      minWidth,
      width: props.tipListWidth || boxWidth,
    };
  }
  //--------------------------------------------------
  // 输出
  //--------------------------------------------------
  return {
    TopClass,
    TopStyle,
    PartMainClass,
    PartMainStyle,
    MainBodyStyle,
    InputStyle,
    BoxBraceStyle,
    BoxTipWrapperStyle,
  };
}

export function makeBoxAspectStyle(props: BoxAspectProps) {
  let re = _.assign({}, props.style);
  if (props.width) {
    re.width = props.width;
  }
  if (props.boxFontSize) {
    re["--box-fontsz"] = `var(--ti-fontsz-${props.boxFontSize})`;
  } else {
    re["--box-fontsz"] = `inherit`;
  }
  if (props.boxPadding) {
    re["--box-padding"] = `var(--ti-box-pad-${props.boxPadding})`;
  }
  if (props.boxRadius) {
    re["--box-radius"] = `var(--ti-measure-r-${props.boxRadius})`;
  }
  if (props.align) {
    re["--box-align"] = props.align;
  }
  if (props.type) {
    _.assign(re, {
      "--box-color-border": `var(--ti-color-${props.type}-b)`,
      "--box-color-text": `var(--ti-color-${props.type})`,
      //'--box-color-bg': `var(--ti-color-${props.type}-r)`,
      "--box-color-focus-border": `var(--ti-color-${props.type})`,
      "--box-color-focus-text": `var(--ti-color-${props.type})`,
      "--box-color-focus-bg": `var(--ti-color-${props.type}-r)`,
    });
  }
  return CssUtils.toStyle(re);
}
