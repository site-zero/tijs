import _ from "lodash";
import { DefineComponent, InjectionKey, Plugin } from "vue";
import {
  Callback2,
  I18n,
  I18nSet,
  IsType,
  TiBus,
  TiIconObj,
  Vars
} from "../../core";

/*
 */
export enum TiComRace {
  /**
   *  输入: 生产比较简单单一的数据类型
   */
  INPUT = "INPUT",
  /**
   *  编辑: 生产比较复杂的数据
   */
  EIDT = "EIDT",
  /**
   * 搁架:组合更多子控件，用作界面布局
   */
  SHELF = "SHELF",
  /**
   *  动作: 按钮、导航条、等执行用户命令
   */
  ACTION = "ACTION",
  /**
   *  小片: 小面积信息展示控件
   */
  TILE = "TILE",
  /**
   *  播放器：展示多媒体内容
   */
  PLAY = "PLAY",
  /**
   *  视图: 通常来处理比较复杂的数据，在页面上占用的面积也比较大
   */
  VIEW = "VIEW"
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
  comConf: Vars;
}

export interface TiComInfo {
  icon?: string;
  race: TiComRace;
  name: string;
  text: string;
  i18n: I18nSet;
  com: any;
  install: Plugin<any[]>;
  defaultProps?: string;
  exampleProps: ComPropExample[];
  /**
   * 当事件发生，需要将 key 对应的事件，存放到comConf 的哪个字段里
   *
   * @default `{change:"value"}`
   */
  exampleModel?: {
    [k: string]: TiComExampleModelTarget;
  };
}

export type ComInfoFilter = (info: TiComInfo) => boolean;

export type TiRawCom = DefineComponent<{}, {}, any>;

export type TiComExampleModelTarget =
  | string
  | {
      key: string;
      val: any;
    };

export class TiCom implements TiComInfo {
  icon: string;
  race: TiComRace;
  name: string;
  text: string;
  i18n: I18nSet;
  com: TiRawCom;
  install: Plugin<any[]>;
  defaultProps?: string;
  exampleProps: ComPropExample[];
  exampleModel?: {
    [k: string]: TiComExampleModelTarget;
  };

  constructor(info: TiComInfo) {
    this.icon = info.icon || "fas-question";
    this.race = info.race;
    this.name = info.name;
    this.text = info.text;
    this.i18n = info.i18n;
    this.com = info.com;
    this.install = info.install;
    this.defaultProps = info.defaultProps;
    this.exampleProps = _.cloneDeep(info.exampleProps);
    this.exampleModel = _.cloneDeep(info.exampleModel);
  }

  getProps(name?: string) {
    if (!name) {
      name = this.defaultProps;
    }
    let it = _.find(this.exampleProps, (it) => it.name == name);
    return it?.comConf;
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

/**
 * 可以被转换为 Icon 对象的类型
 */
export type IconInput = string | TiIconObj;

/*---------------------------------------------------

                      通用结构

---------------------------------------------------*/
export interface FieldStatusIcons {
  pending: IconInput;
  error: IconInput;
  warn: IconInput;
  ok: IconInput;
  highlight: IconInput;
}
export type FieldStatusType = keyof FieldStatusIcons;
export type FieldStatus = {
  /**
   * 状态类型
   */
  type: FieldStatusType;

  /**
   * 状态描述文字
   */
  text: string;
};

/*---------------------------------------------------

                      其他结构

---------------------------------------------------*/

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
  if ("name" != keys[0]) {
    return false;
  }
  if (keys.length > 1 && "payload" != keys[1]) {
    return false;
  }
  if (isT && keys.length > 1 && !isT(input.payload)) {
    return false;
  }
  return true;
}

export type TiEvent<T> = EventInfo<T> & {
  /**
   * 创建时的毫秒时间戳
   */
  created: Date;

  /**
   * 发生控件的控件定义信息
   */
  sourceCom: Pick<
    TiComInfo,
    "name" | "race" | "text" | "i18n" | "exampleModel"
  >;
};

export enum AppEvents {
  APP_RESIZE = "app-resize",
  APP_SCROLL = "app-scroll"
}

export type APP_EVENT = keyof typeof AppEvents;

export type TiEventTrigger<K extends string, T> = (name: K, payload: T) => void;

export type TiEventLightTrigger<K extends string> = TiEventTrigger<
  K,
  undefined
>;

export type TiEmit<K extends string, T> = Callback2<K, TiEvent<T>>;

export type TiAppEvent = TiEvent<any>;
export type TiAppBus = TiBus<TiAppEvent>;
export type TiAppEventTrigger<K extends string> = TiEventTrigger<K, any>;

export const BUS_KEY: InjectionKey<TiAppBus> = Symbol("EVENT_BUS");
