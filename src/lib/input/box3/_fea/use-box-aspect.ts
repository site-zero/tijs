import { CssUtils, getDockingStyle, Rect, Rects, Vars } from "@site0/tijs";
import _ from "lodash";
import { computed, ComputedRef } from "vue";
import { BoxAspectProps } from "./types-box-aspect";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";

export type FeaBoxAspectSetup = {
  isFocused: () => boolean;
  isTipBoxReady: ComputedRef<boolean>;
  isReadonly: () => boolean;
  getElement: () => HTMLElement | null;
  getDockingElement: () => HTMLElement | null;
};

export function useBoxAspect(
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
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      "flex-auto": props.flexAuto,
    })
  );
  //--------------------------------------------------
  const TopStyle = computed(() => makeBoxAspectStyle(props));
  //--------------------------------------------------
  const PartMainClass = computed(() => {
    return {
      "is-focused": isFocused(),
      "show-tips": isTipBoxReady.value,
      "is-readonly": isReadonly(),
    };
  });
  //--------------------------------------------------
  const PartMainStyle = computed(() => {
    let re = _.assign({}, props.partMainStyle);
    if (isTipBoxReady.value) {
      let $el = getElement();
      let _box_rect = Rects.createBy($el!);
      _.assign(re, {
        position:"fixed",
        top: _box_rect.top,
        left: _box_rect.left,
        width: _box_rect.width,
        height: _box_rect.height,
      });
    }
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
    if (!isTipBoxReady.value) {
      return;
    }
    let _box_rect = Rects.createBy($el);
    return CssUtils.toStyle({
      width: _box_rect.width,
      height: _box_rect.height,
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
  let re: Vars = {};
  if (props.width) {
    re.width = props.width;
  }
  if (props.style) {
    _.assign(re, props.style);
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
