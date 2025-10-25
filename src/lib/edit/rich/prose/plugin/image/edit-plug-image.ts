import { RichEditorPlugin } from "../../ti-edit-rich-prose-types";

export const RichEditorImagePlugin: RichEditorPlugin = {
  name: "image",
  setup({ toolbar }) {
    console.log("RichEditorImagePlugin: setup");
    // 注册菜单条
    toolbar.set("image", {
      icon: "zmdi-image",
      tip: "i18n:image",
      action: {
        name: "run:command",
        payload: "insert:image",
      },
    });
  },
  ready({commands}) {
    console.log("RichEditorImagePlugin: ready");
    // 注册命令
    // commands.set("dotest", () => {
    //   console.log("dotest");
    //   return true;
    // });
    commands.set("insert:image", () => {
      console.log("insert:image");
      return true;
    })
  },
};
