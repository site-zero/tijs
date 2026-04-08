import {
  AnyOptionItem,
  Be,
  Convertor,
  IconInput,
  Tmpl,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { BoxIconSetup, useBoxIcon } from "./fea-box-icon";
import { BoxPrefixSuffixProps } from "./types-box-prefix-suffix";

export type BoxPrefixSuffixSetup = BoxIconSetup & {
  getBoxIcon: () => IconInput | undefined;
  getBoxValue: () => any;
  toOptionItem: (it: Vars) => AnyOptionItem;
};

export function useBoxPrefixSuffix(
  props: BoxPrefixSuffixProps,
  setup: Omit<BoxPrefixSuffixSetup, "onOpen">
) {
  const { getBoxIcon, toOptionItem, getBoxValue } = setup;
  //-----------------------------------------------------
  // 打开链接
  //-----------------------------------------------------
  function getOpenLinkConvertor(): Convertor<AnyOptionItem, string> {
    if (props.openLink) {
      // 采用模板
      if (_.isString(props.openLink)) {
        const tmpl = Tmpl.parse(props.openLink);
        return (it) => {
          return tmpl.render(it);
        };
      }
      // 自定义函数
      if (_.isFunction(props.openLink)) {
        const fn = props.openLink;
        return (it) => {
          return fn(it);
        };
      }
    }
    // 默认采用值
    return (it) => {
      return it.value || "#";
    };
  }
  //-----------------------------------------------------
  function genOpenLinkPayload() {
    let val = getBoxValue();
    if (_.isObject(val)) {
      return toOptionItem(val);
    }
    return { value: val };
  }
  //-----------------------------------------------------
  function doOpenLink() {
    const payload = genOpenLinkPayload();
    const link = getOpenLinkConvertor();
    const url = link(payload);
    Be.OpenUrl(url);
  }
  //-----------------------------------------------------
  // Prefix
  //-----------------------------------------------------
  function getBoxPrefix() {
    return useBoxIcon(
      {
        icon: props.prefixIcon,
        hoverIcon: props.prefixHoverIcon,
        iconFor: props.prefixIconFor,
        autoIcon: getBoxIcon(),
        clickEmit: "click:prefix-icon",
      },
      { ...setup, onOpen: doOpenLink }
    );
  }
  //-----------------------------------------------------
  // Suffix
  //-----------------------------------------------------
  function getBoxSuffix() {
    return useBoxIcon(
      {
        icon: props.suffixIcon,
        hoverIcon: props.suffixHoverIcon,
        iconFor: props.suffixIconFor,
        autoIcon: getBoxIcon(),
        clickEmit: "click:suffix-icon",
      },
      { ...setup, onOpen: doOpenLink }
    );
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    getBoxPrefix,
    getBoxSuffix,
  };
}
