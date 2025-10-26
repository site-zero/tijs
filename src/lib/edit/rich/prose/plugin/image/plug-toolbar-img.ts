import { EditorToolbarApi } from "../../api/use-editor-toolbar";

export function setupImageToolbar(toolbar:EditorToolbarApi ) {
  toolbar.set("image", {
    icon: "zmdi-image",
    tip: "i18n:image",
    action: {
      name: "run:command",
      payload: "insert:image",
    },
  });
}