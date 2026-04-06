import { IconInput } from "@site0/tijs";
import { BoxIconSetup, useBoxIcon } from "./fea-box-icon";
import { BoxPrefixSuffixProps } from "./types-box-prefix-suffix";

export type BoxPrefixSuffixSetup = BoxIconSetup & {
  getBoxIcon: () => IconInput | undefined;
};

export function useBoxPrefixSuffix(
  props: BoxPrefixSuffixProps,
  setup: BoxPrefixSuffixSetup
) {
  const { getBoxIcon } = setup;
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
      setup
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
      setup
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
