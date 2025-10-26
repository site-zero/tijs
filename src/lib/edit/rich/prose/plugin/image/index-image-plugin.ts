import { Vars } from "../../../../../../_type";
import {
  RichEditorPlugin,
  RichEditorPluginSetupContext,
} from "../../ti-edit-rich-prose-types";
import { setupImageCommand } from "./plug-cmd-img";
import { setupImageNode } from "./plug-node-img";
import { setupImageToolbar } from "./plug-toolbar-img";

export const RichEditorImagePlugin: RichEditorPlugin = {
  name: "image",
  // 本插件需要的编辑器资源初始设置
  setup(context: RichEditorPluginSetupContext, vars: Vars) {
    console.log("image vars", vars);
    // 注册节点，
    setupImageNode(context);
    // 注册工具栏
    setupImageToolbar(context.toolbar);
  },
  // 当生成了 schema 以后 ...
  ready({ commands }) {
    // 注册命令
    setupImageCommand(commands);
  },
};
