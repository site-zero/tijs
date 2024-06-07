import _ from 'lodash';
import { App, DefineComponent, InjectionKey } from 'vue';
import { FieldName, TableRowID } from '../../lib';
import { I18n, TiBus } from '../ti';
import { Rect } from './ti-rect';
export * from './_types_css';
export { Rect } from './ti-rect';

/*---------------------------------------------------`

                     补足原生

---------------------------------------------------*/
export function isArray<T>(input: any): input is T[] {
  return Array.isArray(input);
}
/*---------------------------------------------------`

                      结构/联合类型

---------------------------------------------------*/
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type TextValue<T> = {
  text: string;
  value: T;
};

export type OptionItem<V> = {
  icon?: IconInput;
  text?: string;
  tip?: string;
  value: V;
};

export type StrOptionItem = OptionItem<string>;
export type NumOptionItem = OptionItem<number>;
export type AnyOptionItem = OptionItem<any>;
export type StdOptionItem = OptionItem<TableRowID>;

export type OptionValueProps = {
  value: any;
  options: AnyOptionItem[];
};

export type DateInput = string | number | Date;
export type DateFormatOptions = {
  fmt?: string;
  trimZero?: boolean;
};

export type TextStrValue = TextValue<string>;

export type NameValue<N, V> = {
  name: N;
  value: V;
};

export type NameStrValue = NameValue<string, string>;
export type NameAnyValue = NameValue<string, any>;

/**
 * 可以被转换为 Icon 对象的类型
 */
export type IconInput = string | IconObj;

export type IconType = 'font' | 'image' | 'emoji';

export type IconObj = {
  type: IconType;
  src?: string; // for image icon
  className?: any; // for font icon
  value?: string; // for emojie
  style?: Vars; // font/image container style
  topClass?: any;
};

export function isIconObj(input: any): input is IconObj {
  if (!input) {
    return false;
  }
  if ('font' == input.type && input.className) {
    return true;
  }
  if ('image' == input.type && input.src) {
    return true;
  }
  return false;
}

export type TiCurrency = {
  value?: number;
  cent?: number;
  yuan?: number;
  currency: string;
};

export type MoneyCurrency = {
  unit?: number;
};

export type TimeInfo = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

export type Limitation = {
  limit: number;
  skip: number;
};

export type Size2D = {
  width: number;
  height: number;
};

export type Point2D = {
  x: number;
  y: number;
};

export type QuadrantName =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type KeyDisplay =
  | string
  | MessageMap
  | MessageMap[]
  | { (s: string): string };

export type BlockEvent = {
  block: string;
  event: string;
};

/** 贴着 水平边 或 垂直边 */
export type DockMode = 'H' | 'V';

export interface DockOptions {
  mode?: DockMode;
  axis?: {
    x?: 'left' | 'right' | 'center' | 'auto';
    y?: 'top' | 'bottom' | 'center' | 'auto';
  };
  space?: number | Point2D;
  viewport?: Rect;
  viewportBorder?: number;
  wrapCut?: boolean;
}

export interface RectInfo {
  width?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  x?: number;
  y?: number;
}

export type Link = {
  target?: '_blank';
  icon?: IconInput;
  text: string;
  href?: string;
};

export type StrCaseFunc = {
  upper: StrConvertor;
  lower: StrConvertor;
  camel: StrConvertor;
  snake: StrConvertor;
  kebab: StrConvertor;
  start: StrConvertor;
};

export type StrCaseMode = keyof StrCaseFunc;
/*---------------------------------------------------

                      逻辑类型

---------------------------------------------------*/
export type LogicType =
  | 'info'
  | 'success'
  | 'warn'
  | 'error'
  | 'track'
  | 'disable';
/*---------------------------------------------------

                     容器

---------------------------------------------------*/
export type TiMap = Map<string, any> | Object;

export interface MessageMap {
  [k: string]: string;
}

export type I18nSet = {
  en_us: MessageMap;
  en_uk: MessageMap;
  zh_cn: MessageMap;
  zh_hk: MessageMap;
};

export type I18nLang = keyof I18nSet;

export type Vars = Record<string, any>;

export type ExplainI18n = {
  and: string;
  blank: string;
  or: string;
  not: string;
  func: string;
  boolFalse: string;
  boolTrue: string;
  undefined: string;
  undefinedOf: string;
  equalsType: string;
  equalsIgnoreCase: string;
  equals: string;
  notEquals: string;
  gt: string;
  gte: string;
  lt: string;
  lte: string;
  matchOf: string;
  exists: string;
  noexists: string;
  nil: string;
  nilOf: string;
  notNil: string;
  notNilOf: string;
  null: string;
  nullOf: string;
  empty: string;
  emptyOf: string;
  findInArray: string;
  emptyItems: string;
  regex: string;
  regexNot: string;
  keyDisplayBy?: KeyDisplay;
};

export type TextContentType = 'html' | 'text';

export type ValueChange<T> = {
  value: T;
  oldVal: T;
};

export type FieldValueChange = ValueChange<any> & {
  uniqKey: string;
};

export type FieldChange = FieldValueChange & {
  name: FieldName;
};

/*---------------------------------------------------

                  回调函数签名

---------------------------------------------------*/
export type FuncA0<R> = () => R;
export type FuncA1<A0, R> = (a0: A0) => R;
export type FuncA2<A0, A1, R> = (a0: A0, a1: A1) => R;
export type FuncA3<A0, A1, A2, R> = (a0: A0, a1: A1, a2: A2) => R;

export type IsType<T> = (input: any) => input is T;

export type Convertor<F, T> = (input: F) => T;

export type AsyncFuncA0<R> = FuncA0<Promise<R>>;
export type AsyncFuncA1<A0, R> = FuncA1<A0, Promise<R>>;
export type AsyncFuncA2<A0, A1, R> = FuncA2<A0, A1, Promise<R>>;
export type AsyncFuncA3<A0, A1, A2, R> = FuncA3<A0, A1, A2, Promise<R>>;

export type AnyConvertor<T> = Convertor<T, T>;

export type ToStr<T> = Convertor<T, string>;

export type ToStrMaybe<T> = Convertor<T, string | undefined>;

export type StrConvertor = Convertor<string, string>;

export type Render<F, T> = (input: F, vars?: Vars) => T;

export type StrRender<T> = Render<T, string>;

export interface TiMatch {
  test: (it: any) => boolean;
  explainText: (i18n: ExplainI18n) => string;
}

export function isTiMatch(input: any): input is TiMatch {
  if (_.isNil(input)) {
    return false;
  }
  if (_.isFunction(input.test) && _.isFunction(input.explainText)) {
    return true;
  }
  return false;
}

export type Predicate<T> = (t: T) => boolean;
export type Iteratee<T> = (t: T) => T;

export type Callback = FuncA0<void>;
export type Callback1<A0> = FuncA1<A0, void>;
export type Callback2<A0, A1> = FuncA2<A0, A1, void>;
export type Callback3<A0, A1, A2> = FuncA3<A0, A1, A2, void>;

export type IsEqual<T> = (t1: T, t2: T) => boolean;

export type ValGetter<T, V> = FuncA1<T, V>;
export type ValTester<V> = ValGetter<V, boolean>;

export type AnyGetter = ValGetter<any, any>;
export type AnyTester = ValGetter<any, boolean>;

export type FuncSet = {
  [k: string]: Function;
};

/*---------------------------------------------------

                  动态调用

---------------------------------------------------*/

export interface InvokeOptions {
  that?: any;
  context?: Vars;
  args?: any[];
  /**
   * 返回函数调用时的 this， 默认为 context
   */
  funcSet?: any;
  partial?: InvokePartial;
  dft?: Function;
}

export type InvokePartial = 'left' | 'right' | 'left?' | 'right?';

export type Invoke = {
  /**
   * Call path
   */
  name: string;
  args: any[];
  /**
   * "left" | "right" | "right?" | Falsy,
   */
  partial?: InvokePartial;
};

export function isInvoke(input: any): input is Invoke {
  if (_.isNil(input)) {
    return false;
  }
  let keys = _.keys(input);
  if (keys.length < 1 || keys.length > 3) {
    return false;
  }
  keys.sort();
  if ('args' != keys[0]) {
    return false;
  }
  if ('name' != keys[1]) {
    return false;
  }
  if (keys.length > 1 && 'partial' != keys[2]) {
    return false;
  }
  return true;
}

export type ToJsValueOptions = {
  autoJson?: boolean;
  autoDate?: boolean;
  autoNil?: boolean;
  autoMap?: boolean;
  autoList?: boolean;
  autoNum?: boolean;
  autoBool?: boolean;
  autoVar?: boolean;
  autoDefault?: boolean;
  trimed?: boolean;
  context?: Vars;
};

export interface ExplainOptions {
  funcSet?: any; // 如果不指定，则用 globalThis
  evalFunc?: boolean;
  iteratee?: { (it: any): any };
  jsValue?: ToJsValueOptions;
}

export interface Explainer {
  explain: { (context: Vars, options: ExplainOptions): any };
}

/*---------------------------------------------------

                接口

---------------------------------------------------*/

export interface WnStack<T> {
  push(item: T): void;

  pop(): T | undefined;

  peek(): T | undefined;

  isEmpty(): boolean;

  search(item: T, isEqual: IsEqual<T>): number;

  popUtil(filter: Predicate<T>, includesive: boolean): T[];

  popAll(): T[];
}
/*-------------------------------------------

              dom 相关的类型

--------------------------------------------*/
export type EleOptions = {
  tagName: string;
  attrs?: Vars;
  props?: Vars;
  data?: Vars;
  className?: string;
  style?: Vars;
  $p?: Element;
  $refer?: Element;
};
export type DomSelector = Element | string;
export type DomQueryContext = Document | Element;

export type ElePredicate<T extends Element> = {
  (el: T): boolean;
};
export type EleIteratee<T extends Element> = {
  (el: T): T | undefined;
};
export type EleFilter<T extends Element> =
  | boolean
  | RegExp
  | DomSelector
  | ElePredicate<T>
  | EleFilter<T>[];

export type SeekUtilOptions<T extends Element> = {
  by?: EleIteratee<T>;
  iteratee: Iteratee<Element>;
  includeSelf: boolean;
  includeStop: boolean;
  reverse: boolean;
};

export type FontSizeOptions = {
  $win: Window;
  phoneMaxWidth: number;
  tabletMaxWidth: number;
  designWidth: number;
  max: number;
  min: number;
  callback?: FontSizeCallback;
};

export type FontSizeCallbackOptions = {
  $win: Window;
  $doc: Document;
  $root: Element;
  mode: string;
  fontSize: number;
  width: number;
  height: number;
};

export type FontSizeCallback = {
  (opt: FontSizeCallbackOptions): void;
};

/*---------------------------------------------------

                      控件

---------------------------------------------------*/
export enum TiComRace {
  /**
   *  输入: 生产比较简单单一的数据类型
   */
  INPUT = 'INPUT',
  /**
   *  编辑: 生产比较复杂的数据
   */
  EIDT = 'EIDT',
  /**
   * 搁架:组合更多子控件，用作界面布局
   */
  SHELF = 'SHELF',
  /**
   *  动作: 按钮、导航条、等执行用户命令
   */
  ACTION = 'ACTION',
  /**
   *  小片: 小面积信息展示控件
   */
  TILE = 'TILE',
  /**
   *  播放器：展示多媒体内容
   */
  PLAY = 'PLAY',
  /**
   *  视图: 通常来处理比较复杂的数据，在页面上占用的面积也比较大
   */
  VIEW = 'VIEW',
}

export interface ComPropExample {
  /**
   * 样例唯一名称（控件内）
   */
  name: string;
  /**
   * 样例显示文本（支持 i18n）
   */
  text?: string;
  /**
   * 样例在控件展示区期望的最小宽度
   * 如果 <Playground> 发现自己的展示区不能满足这个宽度
   * 则会将属性配置区折叠，以便最大限度满足控件的展示
   *
   * 当然如果不声明这个属性，就没有这个特性
   */
  expectWidth?: number;
  /**
   * 样例配置内容
   */
  comConf: Vars | (() => Vars);
}

export type ComInfoFilter = (info: TiComInfo) => boolean;

export type TiRawCom = DefineComponent<{}, {}, any>;

export type TiComExampleModelTarget =
  | string
  | ((val: any, comConf: Vars) => void)
  | {
      key: string;
      val: any;
      mode?: 'set' | 'merge' | 'assign';
    };

export class TiCom implements TiComInfo {
  icon: string;
  race: TiComRace;
  name: string;
  text: string;
  i18n: I18nSet;
  tags: string[];
  liveStyle?: Vars;
  com: TiRawCom;
  events: string[];
  asInner?: boolean;
  install: (app: App) => void;
  defaultProps?: string;
  exampleProps: ComPropExample[];
  exampleModel?: Record<
    string,
    TiComExampleModelTarget | TiComExampleModelTarget[]
  >;

  constructor(info: TiComInfo) {
    this.icon = info.icon || 'fas-question';
    this.race = info.race;
    this.name = info.name;
    this.text = info.text;
    this.i18n = info.i18n;
    this.tags = info.tags || [];
    this.liveStyle = info.liveStyle;
    this.com = info.com;
    this.asInner = info.asInner;
    this.install = info.install;
    this.defaultProps = info.defaultProps;
    this.exampleProps = _.cloneDeep(info.exampleProps);
    this.exampleModel = _.cloneDeep(info.exampleModel);

    this.events = [];
    if (this.com.emits) {
      _.forEach(this.com.emits, (eventName) => this.events.push(eventName));
    }
  }

  getProps(name?: string): Vars | undefined {
    if (!name) {
      name = this.defaultProps;
    }
    //console.log('getProps',name)
    let it = _.find(this.exampleProps, (it) => it.name == name);
    if (_.isFunction(it?.comConf)) {
      return it?.comConf() as Vars;
    }
    return _.cloneDeep(it?.comConf);
  }

  checkProps(name?: string) {
    let props = this.getProps(name);
    if (!props) {
      throw new Error(`Fail to found props: ${name}`);
    }
    return props;
  }

  toString(): string {
    let text = I18n.text(this.text);
    return `[${this.race}] <${text}> #${this.name}`;
  }
}

export interface TiComSet {
  [key: string]: TiComInfo;
}

export interface TiComInfo {
  icon?: string;
  race: TiComRace;
  name: string;
  text: string;
  i18n: I18nSet;
  com: any;
  asInner?: boolean;
  tags?: string[];
  install: (app: App) => void;
  defaultProps?: string;
  // 在 playground 中，显示时， .play-live-con 应该有什么样的样式
  // 通常是为TiInput 等自适应宽度的控件设置一个演示区的默认尺寸等
  liveStyle?: Vars;
  exampleProps: ComPropExample[];
  /**
   * 当事件发生，需要将 key 对应的事件，存放到comConf 的哪个字段里
   *
   * @default `{change:"value"}`
   */
  exampleModel?: {
    [k: string]: TiComExampleModelTarget | TiComExampleModelTarget[];
  };
}

export type ComRef = {
  /**
   * 字段控件定义
   */
  comType?: string;
  /**
   * 字段控件配置
   */
  comConf?: Vars;
};

/**
 * 所有控件都有的属性
 */
export type CommonProps = {
  /**
   * 大多数控件都可以接受一个属性，用来特殊指定自己的特殊类选择器
   */
  className?: any;

  /**
   * 指明自己进行事件通知的策略
   *
   * - `native`: 仅仅采用原生的 emit 事件消息，那么只有父控件才能有机会收到事件
   * - `bus`: 仅仅采用上层主组的 `bus` 总线（`inject(BUS_KEY)`）触发事件，如果没有总线就沉默
   * - `both`: 除了采用原生方式 emit 事件，如果上层注入了 `bus` 也会通知到
   * - `auto`: 【默认】自动判断，如果上层注入了 `bus` 则相当于 `bus模式`，否则相当于 `native模式`
   */
  emitMode?: 'auto' | 'both' | 'native' | 'bus';

  /**
   * 对于自己有子孙的控件，这个属性可以用来批量给自己的子孙设置 `emitMode`
   * 当然这需要控件的实现者，自行使用这个属性
   */
  childEmitMode?: 'auto' | 'both' | 'native' | 'bus';
};
/*---------------------------------------------------

                      事件

---------------------------------------------------*/
export type EventInfo<T> = {
  /**
   * 事件名称
   */
  name: string;
  /**
   * 事件数据参数
   */
  payload?: T;
};

export function isEventInfo<T>(
  input: any,
  isT?: IsType<T>
): input is EventInfo<T> {
  if (_.isNil(input)) {
    return false;
  }
  let keys = _.keys(input);
  if (keys.length < 1 || keys.length > 2) {
    return false;
  }
  keys.sort();
  if ('name' != keys[0]) {
    return false;
  }
  if (keys.length > 1 && 'payload' != keys[1]) {
    return false;
  }
  if (isT && keys.length > 1 && !isT(input.payload)) {
    return false;
  }
  return true;
}

// export type TiEvent<T> = EventInfo<T> & {
//   /**
//    * 创建时的毫秒时间戳
//    */
//   created: Date;

//   /**
//    * 发生控件的控件定义信息
//    */
//   sourceCom: Pick<
//     TiComInfo,
//     'name' | 'race' | 'text' | 'i18n' | 'exampleModel'
//   >;
// };

export enum AppEvents {
  APP_RESIZE = 'app-resize',
  APP_SCROLL = 'app-scroll',
}

// export type APP_EVENT = keyof typeof AppEvents;

// export type TiEventTrigger<K extends string, T> = (name: K, payload: T) => void;

// export type TiEventLightTrigger<K extends string> = TiEventTrigger<
//   K,
//   undefined
// >;

// export type TiEmit<K extends string, T> = Callback2<K, TiEvent<T>>;

export type TiAppBus = TiBus<any>;
// export type TiAppEventTrigger<K extends string> = TiEventTrigger<K, any>;

export const BUS_KEY: InjectionKey<TiAppBus> = Symbol('EVENT_BUS');

// 这个适配函数，接收捕获的事件以及事件参数，然后自行决定 emit 什么
export type CustomizedEmitAdaptor = (
  eventName: string,
  payload: any,
  emit: (name: string, payload?: any) => void
) => void;

export function isCustomizedEmitAdaptor(
  input: any
): input is CustomizedEmitAdaptor {
  return _.isFunction(input);
}

export type EmitAdaptor = string | CustomizedEmitAdaptor;

export type EmitAdaptorProps = {
  emitAdaptors?: Record<string, EmitAdaptor>;
};
/*-------------------------------------------

              web 相关的类型

--------------------------------------------*/
export type KeyboardStatus = {
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

/*-------------------------------------------

              内核需要的控件类型

--------------------------------------------*/
export type VisibilityProps = {
  /**
   * 字段是否可见，是一个 `TiMatch` 匹配 `FormContext`
   */
  visible?: any;
  /**
   * 字段是否隐藏，是一个 `TiMatch` 匹配 `FormContext`
   */
  hidden?: any;
  /**
   * 字段是否不可用，是一个 `TiMatch` 匹配 `FormContext`
   */
  disabled?: any;
  /**
   * 字段是否启用，是一个 `TiMatch` 匹配 `FormContext`
   */
  enabled?: any;
};
/*-------------------------------------------

              动作条

--------------------------------------------*/
export type ActionBarAction = (() => void) | EventInfo<any> | Invoke | string;
export type ActionBarItemInfo = {
  icon?: IconInput;
  text?: string;
  className?: any;
  style?: Vars;
  tip?: string;
};
export type ActionBarItemAltDisplay = ActionBarItemInfo & {
  test?: any;
};
export type ActionBarItem = VisibilityProps &
  ActionBarItemInfo & {
    uniqKey?: string;
    shortcut?: string;
    //.....................................
    altDisplay?: ActionBarItemAltDisplay | ActionBarItemAltDisplay[];
    items?: ActionBarItem[];
    action?: ActionBarAction;
  };
/*-------------------------------------------

              模式框

--------------------------------------------*/
export type BlockInfoProps = {
  // 声明标题栏，如果有 icon || title 就显示标题栏
  icon?: IconInput;
  title?: string;

  /**
   * 块名称
   */
  name?: string;

  //
  // 右上角菜单
  //
  actions?: ActionBarItem[];
  actionVars?: Vars;
  actionClass?: any;

  //
  // 外观样式
  //
  headStyle?: Vars;
  mainStyle?: Vars;
  actionStyle?: Vars;
};
/**
 * 对应到主控件的哪个 Key, 有下面几种绑定方法：
 *
 * 1. `null` 不传递
 * 2. `"value"` 【默认】将 result 传递给 value 属性
 * 3. `["a","b"] 将 result.a 传递给 a 属性，result.b 传递给 b 属性
 * 4. `{a:"x",b:"y"}` 将 result.a 传递给 x 属性，result.b 传递给 y 属性
 */
export type AppModelBindingData =
  | null
  | string
  | string[]
  | Record<string, string>;
/**
 * 主控件的事件，怎么传递给 result
 *
 * 1. `null` 不传递
 * 2. `"change"` 【默认】将 change 事件的 payload 设置为 result
 * 3. `{change:["a","b"]}`
 *     将 change 事件的 payload.a =>result.a,payload.b => result.b
 * 4. `{change:{a:"x",b:"y"}}`
 *     将 change 事件的 payload.a =>result.x,payload.b => result.y
 */
export type AppModelBindingEvent =
  | null
  | string
  | Record<string, string[] | Record<string, string>>;

/**
 * 如何将模式框的 result 绑定到主控件上
 */
export type AppModelBinding = {
  data: AppModelBindingData;
  event: AppModelBindingEvent;
};

export type AppModalProps = CommonProps &
  BlockInfoProps &
  ComRef &
  PopItemProps &
  EmitAdaptorProps &
  Partial<{
    type?: LogicType;
    iconOk?: IconInput;
    textOk?: string | null;
    ok: (re: any) => Promise<boolean>;
    iconCancel?: IconInput;
    textCancel?: string | null;
    cancel: (re: any) => Promise<boolean>;
    actions: ActionBarItem[];
    result?: any;
    // 默认 {data:"value",event:"change"}
    model?: AppModelBinding;
  }>;

export type AppModalInitProps = AppModalProps & {
  returnValue: (re: any) => void;
  releaseDom: () => void;
};

export type TranSpeed = 'slow' | 'normal' | 'fast';
export type TranName =
  | 'ti-slide-up'
  | 'ti-slide-down'
  | 'ti-slide-left'
  | 'ti-slide-right'
  | 'ti-zoom';

export type PopItemProps = {
  position?: PopPosition;
  tranSpeed?: TranSpeed;
  showMask?: boolean;
  clickMaskToClose?: boolean;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  overflow?: string;
};

/**
 * 弹出层的为位置类型，可以适用于 LayoutPaenel，模式对话框，全局弹出框
 */
export type PopPosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'center'
  | 'free'
  | 'left-top'
  | 'right-top'
  | 'bottom-left'
  | 'bottom-right';

/*---------------------------------------------------

       不知道如何分类，但是控件里还有用的类型

---------------------------------------------------*/
export type HtmlSnippetListenner = {
  // 对片段的什么元素?
  selector: string | string[];
  // 的什么事件？
  eventName: string;
  // 进行什么处理？
  handler?: (evt: Event, emit: Callback2<string, any>) => void;
  // 如何初始化
  setup?: (el: HTMLElement) => void;
};

/*---------------------------------------------------

       不知道如何分类，但是控件里还有用的类型

---------------------------------------------------*/
export type AspectSize = 't' | 's' | 'm' | 'b' | 'h';
