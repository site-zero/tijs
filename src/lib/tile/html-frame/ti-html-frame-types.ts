import { CommonProps, Vars } from "@site0/tijs";

export type TiHtmlFrameEmitter = {
  (event: "change", payload: any): void;
};

export type TiHtmlFrameProps = CommonProps & {
  frameClass?: any;
  frameStyle?: Vars;

  // 值就是一个 HTML 文档内容
  // 控件会加文档内容 document.write 到 inner iframe 里去
  value?: string;
};
