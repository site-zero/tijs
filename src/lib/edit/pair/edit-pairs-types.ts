import {
  ButtonProps,
  CommonProps,
  FieldRefer,
  FieldValueType,
  FormProps,
  StrOptionItem,
  TabsAspect,
  Vars,
} from "@site0/tijs";

export type TiEditPairsEmitter = {
  (event: "change", payload: Vars): void;
};

export type EditPairsValueType = "obj" | "str";
export type EditPairsValueMode = "flat" | "nested";
export type EditPairsFormMode = "tabs" | "simple" | "group";
/**
 * 定义组
 */
export type EditPairsGroup = StrOptionItem & {
  /**
   * 指明如何什么样的字段输入本组.
   * 这是一个Match表达式，它的输入就是一个 FormField 对象
   */
  testField: any;

  /**
   * 无论如何，本组都要显示这些字段
   */
  fields?: FieldRefer[];
};

export type TiEditPairsProps = CommonProps &
  TabsAspect & {
    readonly?: boolean;
    /**
     * 输入值
     * - 如果是对象，就直接使用
     * - 如果是字符串，会当做 JSON 来解析
     */
    value?: Vars | string;
    valueType?: EditPairsValueType | "auto";

    /**
     * 输入对象的模式:
     *
     * - `flat`：输入的对象是一个扁平对象，所有字段都是一级键
     * - `nested`：输入的对象是一个嵌套对象，第一层的键，用了做字段分组键
     *
     * 因此在`flat`模式下，如果还想支持分组显示(`tabs|group`) 就需要
     * 定义 `groups` 选项
     */
    valueMode?: EditPairsValueMode;

    /**
     * 用什么方式呈现这个对象编辑界面
     * - `tabs`：用 `TiTabsForm` 来渲染表单
     * - `Simple`：用 `TiForm` 来渲染表单
     * - `Group`：用 `TiForm` 来渲染表单，同时要对字段进行分组
     */
    formMode?: EditPairsFormMode;

    /**
     * 字段分组方式：
     * 如果 `formMode='tabs|group'`，且 `valueMode='flat'`
     * 那么就需要这个选项来为字段分组。
     * 同时，如果是 `nested` 的对象，通过这个选项，可以定制组的图标和标题
     */
    groups?: EditPairsGroup[];

    /**
     * 未归纳分组的字段，如果不想被丢弃，那么需要声明这个属性
     * 在 `formMode='simple'` 模式下，将只关注这个选项
     */
    otherGroup?: EditPairsGroup;

    /**
     * 如果指定了 tabs, 可以为各个 tab 定制表单
     */
    formConfs?: Record<string, Omit<FormProps, "data" | "field">>;

    /**
     * 默认的表单配置
     */
    defaultFormConf?: Omit<FormProps, "data" | "field">;

    /**
     * 可以精细指明各个字段的控件类型
     */
    fields?: Record<string, FieldRefer>;

    /**
     * 指明各个字段的标题【最高优先级】
     * 如果指定它会覆盖 fields 选项的 title 配置
     * 如果是嵌套对象，用 "a.b.c" 这样的键路径来表示
     */
    titles?: Record<string, string>;

    /**
     * 默认的根据字段值，返回控件
     */
    defaultFields?: Record<FieldValueType, FieldRefer>;

    /**
     * 指明对象的 key 哪个不要(默认全要)。
     * 就是一个 TiMatch 表达式，输入的参数就是对象的 key
     * 比如 `{pos:{x:100,y:99}}`，这个匹配器会一次收到:
     *
     * 1. `"pos"`
     * 2. `"pos.x"`
     * 3. `"pos.y"`
     *
     * 三次匹配请求，如果返回 Falsay 就表示不要这个 key
     */
    keyFilter?: any;

    /**
     * 指定名称可以编辑.
     * 你可以编辑为任何名称，前提是这个名称不能违背 keyFilter 选项
     */
    nameEditable?: boolean;

    /**
     * 声明了这个按钮，可以增加自定义键
     */
    newButton?: ButtonProps;
  };
