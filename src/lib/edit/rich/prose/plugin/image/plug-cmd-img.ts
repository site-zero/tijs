import { Command } from "prosemirror-state";
import { EditorCommandsApi } from "../../api/use-editor-commands";

export function setupImageCommand(commands: EditorCommandsApi) {
  // 定义插入图片的命令
  const insertImageCommand: Command = (state, dispatch) => {
    // 获取 image 节点类型
    const imageType = state.schema.nodes.image;

    // 验证 imageType 是否为有效的 NodeType
    if (!imageType || typeof imageType.create !== "function") {
      console.error("错误: image 节点类型无效或缺少 create 方法");
      console.log("imageType 对象:", imageType);
      return false;
    }

    // 创建图片节点属性
    const imgAttrs = {
      //src: "http://demo.local.io:8080/o/content?str=id:qar80pcoo2g5fpra2v957j7fnf",
      src: "https://cdn.wallpapersafari.com/53/14/Mg1YvK.jpg",
      title: "插入的图片",
      style: `height:300px;border:2px solid red;border-radius:20px;`,
    };

    // 创建图片节点
    const imgNode = imageType.create(imgAttrs);

    // 创建事务
    const tr = state.tr.replaceSelectionWith(imgNode).scrollIntoView();

    // 执行事务
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };

  // 注册命令
  commands.set("insert:image", insertImageCommand);
}
