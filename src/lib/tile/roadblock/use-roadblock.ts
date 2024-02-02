import { Callback1, CssUtils, I18n, Link, Vars } from "../../../core";
import { IconInput } from "../../";
import {
  CommonProps,
  IconTextEvents,
  IconTextFeature,
  IconTextOptions,
  IconTextProps,
  IconTextState,
  useIconText
} from "../../features";
import _ from "lodash";
/*-------------------------------------------------------

                     Types

-------------------------------------------------------*/
export type RoadblockMode = "cover" | "fit" | "auto";
export type RoadblockLayout = "A" | "B";
export type RoadblockSize = "small" | "normal" | "big" | "large";
export type RoadblockOpacity = "faint" | "shadowy" | number;
export type RoadblockLink = Link;
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type RoadblockEvents = IconTextEvents;
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type RoadblockProps = CommonProps &
  IconTextProps & {
    mode?: RoadblockMode;
    layout?: RoadblockLayout;
    size?: RoadblockSize;
    opacity?: RoadblockOpacity;
    links?: RoadblockLink[];
  };
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
// export type RoadblockFeature = {
//   state: IconTextState;
//   Roadblock: ComputedRef<IconTextFeature>;
//   Size: ComputedRef<RoadblockSize>;
//   TopClass: ComputedRef<Vars>;
//   IconClass: ComputedRef<Vars>;
//   DisplayIcon: ComputedRef<IconInput>;
//   DisplayText: ComputedRef<string>;
//   hasLinks: ComputedRef<boolean>;
//   setIconHover: Callback1<boolean>;
//   setTextHover: Callback1<boolean>;
// };
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type RoadblockOptions = IconTextOptions<RoadblockEvents, undefined> & {
  defaultIcon: IconInput;
  defaultText: string;
};

function getIconClass(Roadblock: IconTextFeature, Size: RoadblockSize) {
  let css = CssUtils.mergeClassName({}, Roadblock.iconClass);
  let autoIconClass = {
    "small": "s16",
    "normal": "s32",
    "big": "s64",
    "large": "s128"
  }[Size];
  let keys = _.keys(css);
  for (let k of keys) {
    if (/^(s\d+)$/.test(k)) {
      return css;
    }
  }
  css[autoIconClass] = true;
  return css;
}
/*-----------------------------------------------------

                    Use Feature

                Better use it in computed
                
-----------------------------------------------------*/
export function useRoadblock(
  state: IconTextState,
  props: RoadblockProps,
  options: RoadblockOptions
) {
  //
  // 分析参数
  let { defaultIcon, defaultText } = options;

  const Roadblock = useIconText(state, props, options);
  const Size = props.size ?? ("B" == props.layout ? "normal" : "big");
  let hasLinks = !_.isEmpty(props.links);

  return {
    Size,
    ..._.pick(
      Roadblock,
      "showIcon",
      "showText",
      "OnClickIcon",
      "OnClickText",
      "setIconHover",
      "setTextHover"
    ),
    //.......................................
    TopClass: Roadblock.getClassName(
      props.className,
      `mode-${props.mode || "fit"}`,
      `layout-${props.layout || "A"}`,
      Size,
      _.isString(props.opacity) ? props.opacity : null,
      {
        "has-links": hasLinks
      }
    ),
    //.......................................
    TopStyle: CssUtils.mergeStyles([
      Roadblock.style,
      _.isNumber(props.opacity) ? { opacity: props.opacity } : {}
    ]),
    //.......................................
    IconClass: getIconClass(Roadblock, Size),
    IconStyle: Roadblock.iconStyle,
    //.......................................
    TextClass: Roadblock.textClass,
    TextStyle: Roadblock.textStyle,
    //.......................................
    DisplayIcon: Roadblock.icon || defaultIcon,
    DisplayText: Roadblock.text || I18n.text(defaultText),
    //.......................................
    hasLinks,
    //.......................................
    setIconHover: function (hovred: boolean) {
      state.iconHovered = hovred;
    },
    setTextHover: function (hovred: boolean) {
      state.textHovered = hovred;
    }
  };
}