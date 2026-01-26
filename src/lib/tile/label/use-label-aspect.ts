import _ from "lodash";
import { computed } from "vue";
import { CssUtils } from "../../../core";
import { LabelProps } from "./ti-label-types";
import { LabelIconApi } from "./use-label-icon";

export function useLabelAspect(
  props: LabelProps,
  _prefix: LabelIconApi,
  _suffix: LabelIconApi
) {
  //--------------------------------------------------
  const hasValue = computed(() => {
    if (props.hasValue) {
      return props.hasValue(props.value);
    }
    if ("" === props.value || _.isNil(props.value)) {
      return false;
    }
    return true;
  });
  //--------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      [`is-${props.type}`]: props.type ? true : false,
      "has-value": hasValue.value,
      "nil-value": !hasValue.value,
      "is-nowrap": props.nowrap,
      "show-border": props.showBorder,
      "can-click": props.clickable,
      "nil-prefix-icon": !_prefix.hasIcon.value,
      "has-prefix-icon": _prefix.hasIcon.value,
      "nil-suffix-icon": !_suffix.hasIcon.value,
      "has-suffix-icon": _suffix.hasIcon.value,
    });
  });
  //--------------------------------------------------
  const TopStyle = computed(() => {
    let re = CssUtils.toStyle(props.style);
    if (props.width) {
      re.width = props.width;
    }
    _.assign(re, {
      "--box-color-hover-icon": "var(--ti-color-primary-r)",
      "--box-color-hover-icon-bg": "var(--ti-color-primary)",
    });
    if (props.boxFontSize) {
      re["--box-fontsz"] = `var(--ti-fontsz-${props.boxFontSize})`;
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
      // 指定主颜色在背景上
      if ("box" == props.colorMode) {
        _.assign(re, {
          "--box-color-border": `var(--ti-color-${props.type}-b)`,
          "--box-color-text": `var(--ti-color-${props.type}-r)`,
          "--box-color-bg": `var(--ti-color-${props.type})`,
          "--box-color-hover-icon": `var(--ti-color-${props.type})`,
          "--box-color-hover-icon-bg": `var(--ti-color-${props.type}-r)`,
        });
      }
      // 默认主颜色在文字上
      else {
        _.assign(re, {
          "--box-color-border": `var(--ti-color-${props.type}-b)`,
          "--box-color-text": `var(--ti-color-${props.type})`,
          "--box-color-bg": `var(--ti-color-${props.type}-r)`,
          "--box-color-hover-icon": `var(--ti-color-${props.type}-r)`,
          "--box-color-hover-icon-bg": `var(--ti-color-${props.type})`,
        });
      }
    } else {
      _.assign(re, {
        "--box-color-border": "var(--ti-color-border-dark)",
      });
    }
    return re;
  });
  //--------------------------------------------------
  const ValuePartStyle = computed(() => {
    return CssUtils.toStyle(props.valuePartStyle);
  });
  //--------------------------------------------------
  return {
    TopClass,
    TopStyle,
    ValuePartStyle,
  };
}
