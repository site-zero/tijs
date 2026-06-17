import _ from "lodash";
import {
  IconTextEvents,
  IconTextFeature,
  IconTextOptions,
  IconTextState,
  UseIconEvents,
  UseTextEvents,
  useIconText,
} from "@site0/tijs";
import { AspectSize, IconInput, toAspectFontSize } from "../../../_type";
import { CssUtils, I18n } from "../../../core";
import { RoadblockProps } from "./ti-roadblock-types";
/*-------------------------------------------------------

                     Types

-------------------------------------------------------*/

/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type RoadblockEvents = IconTextEvents;
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/

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
export type RoadblockOptions = IconTextOptions<UseIconEvents, UseTextEvents> & {
  defaultIcon: IconInput;
  defaultText: string;
};

function getIconClass(Roadblock: IconTextFeature, Size: AspectSize) {
  let css = CssUtils.mergeClassName({}, Roadblock.iconClass);
  let autoIconClass = (
    {
      t: "s16",
      s: "s32",
      m: "s64",
      b: "s128",
      h: "s256",
    } as Record<AspectSize, string>
  )[Size];
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
  const Size: AspectSize = props.size ?? ("B" == props.layout ? "m" : "b");
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
      _.isString(props.opacity) ? props.opacity : null,
      {
        "has-links": hasLinks,
      }
    ),
    //.......................................
    TopStyle: CssUtils.mergeStyles([
      { fontSize: toAspectFontSize(Size) },
      _.isNumber(props.opacity) ? { opacity: props.opacity } : {},
      Roadblock.style,
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
    },
  };
}
