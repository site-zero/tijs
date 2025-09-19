import {
  ActionBarEmitter,
  ActionBarProps,
  ImageProps,
  ProgressBarProps,
  TextSnippetProps,
} from "../../";
import {
  ActionBarItem,
  ActionBarItemInfo,
  AspectSize,
  CommonProps,
  CssAlignment,
  LogicType,
  Vars,
} from "../../../_type";

export type AbstracUploadEmitter = ActionBarEmitter & {
  (event: "upload", payload: File): void;
  (event: "clear"): void;
  (event: "stop-upload"): void;
};

export type AbstractUploaderProps = CommonProps & {
  //-----------------------------------------------------
  // Data
  //-----------------------------------------------------
  preview?: ImageProps;
  progress?: ProgressBarProps;
  text?: string | TextSnippetProps;
  tip?: string;
  nilValue?: boolean; // 是否是空值

  //-----------------------------------------------------
  // Actions
  //-----------------------------------------------------
  uploadButton?: ActionBarItemInfo | boolean;
  clearButton?: ActionBarItemInfo | boolean;
  actions?: ActionBarItem[];
  actionBar?: Omit<ActionBarProps, "items">;
  accept?: string;
  multi?: boolean;
  //-----------------------------------------------------
  // Aspect
  //-----------------------------------------------------
  type?: LogicType;
  //-----------------------------------------------------
  width?: string | number;
  height?: string | number;
  style?: Vars;
  //-----------------------------------------------------
  textSize?: AspectSize;
  textPadding?: AspectSize;
  textAlign?: CssAlignment;
  boxRadius?: AspectSize;
  //-----------------------------------------------------
};
