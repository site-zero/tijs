import { CssUtils, Vars, ViewportApi } from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { BoxAspectProps } from "./types-box-aspect";

export type FeaBoxAspectSetup = {
  isFocused: () => boolean;
  isTipBoxReady: () => boolean;
  isReadonly: () => boolean;
  getViewport: () => ViewportApi;
  getTipMainBoxStyle: () => Vars;
};

export function feaBoxAspect(
  props: BoxAspectProps,
  options: FeaBoxAspectSetup
) {
  const {
    isFocused,
    isTipBoxReady,
    isReadonly,
    getViewport,
    getTipMainBoxStyle,
  } = options;
  const _viewport = getViewport();
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
    let re = _.assign(
      CssUtils.toStyle(props.partMainStyle),
      getTipMainBoxStyle()
    );
    re["--box-w"] = `${_viewport.size.width}px`;
    re["--box-h"] = `${_viewport.size.height}px`;
    return re;
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
  // 输出
  //--------------------------------------------------
  return {
    TopClass,
    TopStyle,
    PartMainClass,
    PartMainStyle,
    MainBodyStyle,
    InputStyle,
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
