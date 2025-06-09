import { CommonProps } from "@site0/tijs";

export type TinyMCEditorEmitter = {
  (event: "change", payload: string): void;
};

export type TinyMCEditorProps = CommonProps & {
  // 这里放置控件支持的属性
  initialValue?: string;
};