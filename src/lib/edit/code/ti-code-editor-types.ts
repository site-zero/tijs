import { CommonProps, ObjDataStatus, Vars, WindowTheme } from "../../../_type";
import { RoadblockProps } from "../../../lib";

export type CodeEditorEmitter = {
  (event: "change", payload: string): void;
};

export type CodeEditorProps = CommonProps & {
  style?: Vars;
  value?: any;
  editorStatus?: ObjDataStatus;
  editorStyle?: Vars;
  editorOptions?: Vars;
  editorTheme?: Record<WindowTheme, string>;
  theme?: WindowTheme | "auto";
  type?: string;
  mime?: string;
  readonly?: boolean;

  format?: "JSON" | "JSON5" | ((str: string) => string);
  /**
   * 用户键入修改，要做多长时间的反弹跳延迟
   * 默认 1000 毫秒，也就是 1 秒
   */
  debounce?: number;
  /**
   * 空白数据，显示的样式
   */
  emptyRoadblock?: RoadblockProps;
};
