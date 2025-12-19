import _ from "lodash";
import { CssUtils } from "../../../../core";
import { GridLayoutStyleFeature } from "../../../../lib";
import { GridResizingState, LayoutGridProps } from "./ti-layout-grid-types";

export function getTopStyle(
  state: GridResizingState,
  props: LayoutGridProps,
  GridLayout: GridLayoutStyleFeature
) {
  let css = CssUtils.mergeStyles([props.gridStyle || {}, GridLayout.layoutCss]);

  // if (
  //   !props.blocks ||
  //   (2 == props.blocks?.length && props.blocks[1].name == "cp_ques")
  // ) {
  //   console.log(
  //     "hahahaha!!!!  getTopStyle",
  //     props.gridStyle,
  //     GridLayout.layoutCss
  //   );
  // }

  if (!_.isEmpty(state.rows)) {
    css.gridTemplateRows = state.rows.join(" ");
  }
  if (!_.isEmpty(state.columns)) {
    css.gridTemplateColumns = state.columns.join(" ");
  }

  return css;
}
