import { CommonProps } from "../../";
import { Vars } from "../../../core";
import { FormField, FormFieldAboutProps } from "./use-form-field";

export type FormProps = CommonProps &
  FormFieldAboutProps & {
    //-----------------------------------
    // Data
    //-----------------------------------
    /**
     * 从表单传入的数据对象
     */
    data?: Vars;
    /**
     * 用例判断 visiblity 的上下文变量
     * 会在 FormContext 里与 data 融合
     */
    vars?: Vars;
    /**
     * merge each time data change
     */
    fixed?: Vars;
    //-----------------------------------
    // All Fields in Form
    //-----------------------------------
    fields?: FormField[];
    //-----------------------------------
    // Behavior
    //-----------------------------------
    /**
     * 是否表单仅仅处理字段表中的字段
     *
     * @default true
     */
    onlyFields?: boolean;
    /**
     * 所有隐藏字段，将不会被表单输出，
     * 开启这个选线，相当于也同时开启了 `onlyFields`
     *
     * @default false
     */
    omitHiddenFields?: boolean;

    /**
     * 当表单获取数据时，采用的策略：
     *
     *  - `all` : all data will be taken and return
     *  - `diff` : only changed field will be taken
     *  - `auto` : `diff` if `notifyMode` is `confirm`, else as `all`
     *
     * * @default "auto"
     */
    dataMode?: "all" | "diff" | "auto";

    /**
     * 当表单字段任何一个字段发生改变，实际上发生两件事：
     *
     * 1. `field-change` : 字段改动了
     * 2. `change` : 整个表单的数据都改动了
     *
     * 有时候，我们并不希望表单将两个事件都通知到外部。譬如，我们在一个类似 JSON 编辑的场景
     * 采用表单控件编辑 JSON 对象的内容。 这时 `field-change` 对这个场景没用。
     * 我们总是希望能拿到数据最完整的信息。直接存成一个 JSON 文本。
     *
     * 又比如，一个对象元数据编辑，我们希望每次字段改动都要通知服务器及时保存，那么 `change`
     * 的事件就没用了
     *
     * 为此，我们可以允许你指定下面的通知策略：
     *
     * - `immediate` : 先发送 `field-change` 接着立刻发送 `change`
     * - `data` :  仅发送 `change`
     * - `field` : 仅发送 `field-change`
     * - `confirm` : 显示一个确认按钮，当用户点击确认，发送 `change`
     * - `none` : 啥都不通知，保持静默
     * - `auto` : 如果`readonly==true`，相当于 `none`，否则相当于 `immediate`
     *
     * @default "auto"
     */
    notifyMode?: "immediate" | "data" | "field" | "confirm" | "none" | "auto";

    autoShowBlank?: boolean;
    //-----------------------------------
    // Aspect
    //-----------------------------------
    /**
     * 显示表格的标题
     */
    title?: string;

    /**
     *  当表单数据为空时，将显示为一个指定的路障牌
     */
    blankAs?: Vars;

    /**
     * 表单的字段分组模式：
     *
     *  - `group` 字段分组显示
     *  - `group` 字段分标签页显示
     */
    mode?: "group" | "tab";
  };

export type FormGridHint = [number, number] | number;
