import { RichEditorPlugin } from "../../ti-edit-rich-prose-types";

export const RichEditorTestPlugin: RichEditorPlugin = {
  name: "test",
  setup({ toolbar }) {
    console.log("setup toolbar");
    // 注册菜单条
    toolbar.set("test", {
      ///text: "Test",
      icon: "fas-flask",
      action: {
        name: "run:command",
        payload: "dotest",
      },
    });
  },
  ready({ commands }) {
    // 注册命令
    commands.set("dotest", () => {
      console.log("dotest");
      return true;
    });
  },
};
