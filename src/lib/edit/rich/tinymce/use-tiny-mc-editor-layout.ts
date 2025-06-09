import { LayoutGridProps } from "@site0/tijs";
import { TinyMCEditorProps } from "./ti-tiny-mc-editor-types";

export function useTinyMCEditorLayout(
  _props: TinyMCEditorProps
): LayoutGridProps {
  return {
    className: "fit-parent as-card with-shadow r-s",
    keepSizes: "local: GUI-TiTinyMCEditor-Layout-Sizes",
    gridStyle: {
      backgroundColor: "var(--ti-color-body)",
      padding: "var(--ti-gap-m)",
    },
    layout: {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr",
      gap: "var(--ti-gap-m)",
    },
    blocks: [
      {
        name: "editor",
        grid: { gridColumn: "span 1" },
      },
    ],
  };
}