import {
  ActionBarEmitter,
  ActionBarProps,
  AppModalProps,
  CommonProps,
  PlaceholderProps,
  TagsProps,
  TextSnippetProps,
  Vars,
} from "@site0/tijs";

export type FilterBarEmitter = ActionBarEmitter & {
  (event: "change", newValue: Vars): void;
  (event: "search", newValue: Vars): void;
  (event: "reset"): void;
};

export type FilterBarProps = CommonProps &
  PlaceholderProps & {
    /**
     * 传入的数据对象
     */
    value?: Vars;
    //-----------------------------------------------------
    // Aspect
    //-----------------------------------------------------
    tags?: TagsProps;
    //-----------------------------------------------------
    // Behaviors
    //-----------------------------------------------------
    /**
     * 动作条，默认为search与reset 两个按钮。
     * 如果 `{items:[]}` 则表示不显示动作条。
     */
    actions?: ActionBarProps;
    /**
     * 上下文变量，除非 actions 定义了自己的 vars
     * 否则，默认的，也会采用本属性作为动作条的上下文变量集
     */
    vars?: Vars;
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
