import {
  ButtonProps,
  CommonProps,
  FieldRefer,
  FieldValueType,
  FormProps,
  IconInput,
  StrOptionItem,
  TabsAspect,
  Vars,
} from "@site0/tijs";

export type EditPairsEmitter = {
  (event: "change", payload: Vars): void;
};

export type EditPairsProps = CommonProps &
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
     * 控件会自动分析输入对象，这里指定递归分析几层
     * 如果为 `0`, 则会无穷递归下去，所有的键只要不是对象就是字段
     * 如果为 `1`, 那么只有第一层（顶级）对象字段会认为是字段
     * 如果为 `2`, 第一层对象通常是分类 key
     *
     * 譬如输入对象:
     * ```js
     * {
     *   general: {
     *     name: "xiaobai",
     *     age: 12
     *   },
     *   address: {
     *     city: "BeiJing",
     *     postcode: "100086",
     *     phone: {
     *       work: "83145672",
     *       mobile: "13910110054"
     *     }
     *   }
     * }
     * ```
     *
     * 如果 `0`，则会认为有下面的字段
     *  - 'general.name'
     *  - 'general.age'
     *  - 'address.city'
     *  - 'address.postcode'
     *  - 'address.phone.work'
     *  - 'address.phone.mobile'
     *
     * 如果为 `1`，则会认为有下面字段
     *  - 'general'
     *  - 'address'
     *
     * 如果为 `2`，则会认为有下面字段
     *  - 'general.name'
     *  - 'general.age'
     *  - 'address.city'
     *  - 'address.postcode'
     *  - 'address.phone'
     *
     * 默认的，这个属性值为 `0`
     */
    fieldDepth?: number;

    /**
     * 可以精细指明各个字段的控件类型，如果没有指定，则会默认
     * 为每种字段按值的类型自动分配编辑控件
     *
     * 这个设置可以自动试退，即如果你声明了 "general"
     * 那么所有 "general.xxx" 字段都会默认采用这个设置
     * 除非，你给出更详细的字段名，字段名是分段(`.`分隔)试退
     *
     * 如果都没定义，则会根据值的类型，寻找字段的控件
     */
    fields?: Record<string, FieldRefer>;

    /**
     * 默认的根据字段值，返回控件。 这里
     */
    defaultFields?: Partial<Record<FieldValueType, FieldRefer>>;

    /**
     * 用什么方式呈现这个对象编辑界面
     * - `tabs`：用 `TiTabsForm` 来渲染表单
     * - `form`：用 `TiForm` 来渲染表单
     */
    formMode?: EditPairsFormMode;

    /**
     * 字段分组方式, 没有就不分组，因此对于 Tabs 模式
     * 一定是需要这个分组设置的。
     * 
     * 通常，你需要一个 `{ text: "Other", value: "o", fields: ["*"] }`
     * 来容纳所有未包括进任何组的字段
     */
    groups?: EditPairsGroup[];

    /**
     * 默认的表单配置
     */
    formConf?: Omit<FormProps, "data" | "fields">;

    /**
     * 如果是 Tabs Form，这里可以单独指定 Tabs 的配置项
     */
    tabsConf?: TabsAspect;

    /**
     * 指明各个字段的标题【最高优先级】
     * 如果指定它会覆盖 fields 选项的 title 配置
     * 如果是嵌套对象，用 "a.b.c" 这样的键路径来表示
     */
    titles?: Record<string, string>;

    /**
     * 指明各个字段的图标【最高优先级】
     * 如果指定它会覆盖 fields 选项的 icon 配置
     * 如果是嵌套对象，用 "a.b.c" 这样的键路径来表示
     */
    icons?: Record<string, IconInput>;

    /**
     * 指明各个字段的提示信息【最高优先级】
     * 如果指定它会覆盖 fields 选项的 tips 配置
     * 如果是嵌套对象，用 "a.b.c" 这样的键路径来表示
     */
    tips?: Record<string, string>;

    /**
     * 指定名称可以编辑.
     * 你可以编辑为任何名称，前提是这个名称不能违背 keyFilter 选项
     * 也就是说，你虽然可以创建这个键值对，但是 keyFilter 可以把它过滤掉
     */
    nameEditable?: boolean;

    /**
     * 声明了这个按钮，可以增加自定义键
     */
    newButton?: ButtonProps;
  };

export type EditPairsValueType = "obj" | "str";
export function isEditPairsValueType(input: any): input is EditPairsValueType {
  return /^obj|str$/.test(input);
}
export type EditPairsValueMode = "flat" | "nested";
export function isEditPairsValueMode(input: any): input is EditPairsValueMode {
  return /^flat|nested$/.test(input);
}

/**
 * 用什么方式呈现这个对象编辑界面
 *
 * - `tabs`：用 `TiTabsForm` 来渲染表单
 * - `form`：用 `TiForm` 来渲染表单
 */
export type EditPairsFormMode = "tabs" | "form";
export function isEditPairsFormMode(input: any): input is EditPairsFormMode {
  return /^tabs|form$/.test(input);
}

/**
 * 定义组
 */
export type EditPairsGroup = StrOptionItem & {
  /**
   * 无论如何，本组都要显示这些字段。
   * 这里就是一个字段名列表，譬如
   * ["general.name","general.age"]
   *
   * 同时，这也可以用来声明一个固定的字段顺序
   *
   * 快捷字符串表示法:
   *
   * - `---` : 三个以上减号开头表示字段分隔标签
   * - `^` : 正则动态匹配
   * - `*` : 通配符动态匹配
   * - `xxx` :  其他就是精确匹配
   *
   */
  fields: any[];
};
