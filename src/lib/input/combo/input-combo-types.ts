import {
  BoxAspectProps,
  BoxCompositionProps,
  BoxDropListProps,
  BoxIconEmit,
  BoxPrefixSuffixProps,
  BoxValueProps,
  CommonProps,
  DisplayTextProps,
  OptionItemProps,
  PlaceholderProps,
  ReadonlyProps,
  ValuePipeProps,
  Vars,
} from "@site0/tijs";

export type InputComboEmitter = {
  (event: "change", payload: any): void;
  (event: "blur"): void;
  (event: "focus"): void;
  (event: BoxIconEmit): void;
  (event: "click", payload: any): void;
};

export type InputComboProps = CommonProps &
  BoxCompositionProps &
  DisplayTextProps &
  PlaceholderProps &
  ReadonlyProps &
  OptionItemProps<any> &
  BoxDropListProps &
  BoxAspectProps &
  ValuePipeProps &
  BoxPrefixSuffixProps<any> &
  BoxValueProps & {
    /**
     * 根据当前输入内容异步加载可选项。
     *
     * @param query 当前输入框中的查询文本
     * @returns 返回用于渲染下拉选项的数据列表
     */
    loadOptions?: (query?: string | null | undefined) => Promise<Vars[]>;
    /**
     * 延迟多少毫秒（反弹跳）才查询提示信息，默认 500ms
     * 同样，这个设置，也会影响 pipe 的应用反弹跳阈值
     */
    tipShowDelay?: number;

    /**
     * 当 focus 自动聚焦 Input 框
     */
    autoSelect?: boolean;

    /**
     * 当创建的时候，自动 focus 控件
     */
    autoFocus?: boolean;

    /**
     * @see InputBoxProps#useTextWhenFocus
     */
    useTextWhenFocus?: boolean;

    /**
     * 是否显示调试信息
     */
    showDebugInfo?: boolean;
  };
