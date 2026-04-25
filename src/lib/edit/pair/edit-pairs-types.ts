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
     * 如果指定这个选项，输入的对象，第一层，会被认为是字段分组
     * 会用 `TiTabsForm` 来渲染表单，这个数据就是 `tabs` 选项
     *
     * 其中 `tabs[0].value` 对应的是对象第一层的键名
     */
    tabs?: StrOptionItem[];
    /**
     * 如果没被tabs 包括的字段，会被丢弃
     * 如果不想被丢弃，那么需要生命这个属性
     */
    otherTabs?: StrOptionItem;

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
