import { LayoutGridProps } from "@site0/tijs";
import { EditPairsProps } from "./edit-pairs-types";
import { EditPairsApi } from "./use-edit-pairs-api";

export function useEditPairsLayout(
  _props: EditPairsProps,
  api: EditPairsApi
): LayoutGridProps {
  //-----------------------------------------------------
  let shown = { tabs: api.FormMode.value == 'tabs' };
  //-----------------------------------------------------
  let gridTemplateRows = '1fr';
  if (api.FormMode.value == 'tabs') {
    gridTemplateRows = 'auto 1fr'
  }
  //-----------------------------------------------------
  return {
    className: "fit-parent as-card with-shadow r-s",
    keepSizes: "local: GUI-EditPairs-Layout-Sizes",
    gridStyle: {
      backgroundColor: "var(--ti-color-body)",
      //padding: "var(--ti-gap-m)",
    },
    layout: {
      gridTemplateColumns: "1fr",
      gridTemplateRows,
      //gap: "var(--ti-gap-m)",
    },
    shown,
    blocks: [
      {
        name: "tabs",
      },
      {
        name: "main",
        overflowMode: "cover",
      },
    ],
  };
}