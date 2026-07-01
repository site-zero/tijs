import {
  ActionBarEmitter,
  ActionBarItem,
  ActionBarItemInfo,
  ActionBarProps,
  AspectSize,
  CommonProps,
  CssAlignment,
  ImageProps,
  LogicType,
  ProgressBarProps,
  TextSnippetProps,
  Vars,
} from "@site0/tijs";

export type AbstracUploadEmitter = ActionBarEmitter & {
  (event: "upload", payload: File): void;
  (event: "clear"): void;
  (event: "stop-upload"): void;
  (event: "choose-file"): void;
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
  readonly?: boolean;
  //-----------------------------------------------------
  // Actions
  //-----------------------------------------------------
  uploadButton?: ActionBarItemInfo | boolean;
  clearButton?: ActionBarItemInfo | boolean;
  actions?: ActionBarItem[];
  actionBar?: Omit<ActionBarProps, "items">;
  accept?: string;
  multi?: boolean;
  /**
   * 当没有选择文件时，左侧按钮可以用来选择已经上传的文件
   */
  canEmptyChooseFile?: boolean;
  /**
   * 如果已经有了文件，默认只能删除再上传，除非开启这个选项
   */
  canReplace?: boolean;
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

export type UploadDroppingSetup = {
  setDragEnter: (value: boolean) => void;
  getTarget: () => HTMLElement | null;
  emit: AbstracUploadEmitter;
  isInProgress: () => boolean;
  canReplace: () => boolean;
  hasValue: () => boolean;
};
