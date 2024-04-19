import _ from 'lodash';
import {
  ActionBarItem,
  BlockInfoProps,
  ComRef,
  CommonProps,
  IconInput,
  LogicType,
  PopItemProps,
} from '../../lib';
import { Rect } from './ti-rect';
export { Rect } from './ti-rect';

/*---------------------------------------------------`

                      结构/联合类型

---------------------------------------------------*/
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type TextValue<T> = {
  text: string;
  value: T;
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

export type TiIconObj = {
  type: 'font' | 'image';
  src?: string; // for image icon
  className?: any; // for font icon
  style?: Vars; // font/image container style
};

export function isIconObj(input: any): input is TiIconObj {
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

/*-------------------------------------------------------

                     Css 相关
-------------------------------------------------------*/
export type CssItemAlignment = 'start' | 'end' | 'center' | 'stretch';
export type CssContentAlignment =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';
export type CssGridAutoFlow =
  | 'row'
  | 'column'
  | 'dense'
  | 'row dense'
  | 'column dense';
export type CssGridLayout = Partial<{
  // Track
  gridTemplateColumns: string;
  gridTemplateRows: string;
  /*
  [
    "header header header header",
    "main   main   .      sidebar",
    "footer footer footer footer",
  ]
   */
  gridTemplateAreas: string[];
  // Gap
  gridColumnGap: string;
  gridRowGap: string;
  // <grid-row-gap> <grid-column-gap>
  gap: string;
  // Alignment
  justifyItems: CssItemAlignment;
  alignItems: CssItemAlignment;
  justifyContent: CssContentAlignment;
  alignContent: string;
  // Extends
  gridAutoColumns: string;
  gridAutoRows: string;
  gridAutoFlow: CssGridAutoFlow;
}>;

export type CssGridItem = Partial<{
  // <grid-column-start> <grid-column-end>
  gridColumn: string;
  // <number> | <name> | span <number> | auto
  gridColumnStart: string;
  // <number> | <name> | span <number> | auto
  gridColumnEnd: string;
  // <grid-row-start> <grid-row-end>
  gridRow: string;
  // <number> | <name> | span <number> | auto
  gridRowStart: string;
  // <number> | <name> | span <number> | auto
  gridRowEnd: string;
  // <name> | <row-start> / <column-start> / <row-end> / <column-end>
  gridArea: string;
  justifySelf: CssItemAlignment;
  alignSelf: CssItemAlignment;
}>;

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
  partial?: invoke_partial;
  dft?: Function;
}

export type invoke_partial = 'left' | 'right' | 'left?' | 'right?';

export type Invoke = {
  /**
   * Call path
   */
  name: string;
  args: any[];
  /**
   * "left" | "right" | "right?" | Falsy,
   */
  partial?: invoke_partial;
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

export interface ExplainOptions {
  funcSet?: any; // 如果不指定，则用 globalThis
  evalFunc?: boolean;
  iteratee?: { (it: any): any };
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

              模式框

--------------------------------------------*/

export type AppModalProps = CommonProps &
  BlockInfoProps &
  ComRef &
  PopItemProps &
  Partial<{
    type?: LogicType;
    iconOk: IconInput;
    textOk: string;
    ok: (re: any) => Promise<boolean>;
    iconCancel: IconInput;
    textCancel: string;
    cancel: (re: any) => Promise<boolean>;
    actions: ActionBarItem[];
    result?: any;
  }>;

export type AppModalInitProps = AppModalProps & {
  returnValue: (re: any) => void;
  releaseDom: () => void;
};
