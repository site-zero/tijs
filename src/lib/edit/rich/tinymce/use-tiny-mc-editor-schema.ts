import { LayoutSchema } from "@site0/tijs";
import { TinyMCEditorProps } from "./ti-tiny-mc-editor-types";
import { useTinyMCEditorLayout } from "./use-tiny-mc-editor-layout";

export function useTinyMCEditorSchema(
  props: TinyMCEditorProps
): LayoutSchema {
  return {
    editor: {
      comType: "TiTinyMCEditor",
      comConf: props,
    },
  };
}