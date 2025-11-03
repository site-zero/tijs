import {
  ActionBarProps,
  AppModalProps,
  CommonProps,
  FormProps,
  IconInput,
  TextSnippetProps,
  Vars,
} from "@site0/tijs";

export type FilterBarEmitter = {
  (event: "change", payload: Vars): void;
};

export type FilterBarProps = CommonProps & {
  /**
   * 传入的数据对象
   */
  data?: Vars;
  //-----------------------------------------------------
  // Aspect
  //-----------------------------------------------------
  /**
   * 如果没有数据项，显示什么占位信息
   */
  emptyRoadblock?: {
    text?: string;
    icon?: IconInput;
  };
  //-----------------------------------------------------
  // Behaviors
  //-----------------------------------------------------
  /**
   * 动作条表示
   */
  actions?: ActionBarProps;
  //-----------------------------------------------------
  // 扩展表单
  //-----------------------------------------------------
  /**
   * 详情编辑组件的类型，默认 `TiForm`
   */
  comType?: string;
  /**
   * 指定组件的配置项
   */
  comConf?: Vars;
  /**
   * 详情编辑组件的弹窗配置项。
   * 可以直接在这里指定 `comType` 和 `comConf`
   */
  panel?: AppModalProps;
  //-----------------------------------------------------
  // 头部和尾部的可配置扩展槽
  //-----------------------------------------------------
  head?: TextSnippetProps;
  tail?: TextSnippetProps;
};
