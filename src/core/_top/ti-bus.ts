import _ from "lodash";
import { Match, getEnv } from "../";
import {
  BusDeposer,
  BusListenerHanlder,
  BusMsg,
  TiBus,
  TiMatch,
} from "../../_type";

class BusListener<T> {
  _name: string;
  _match: TiMatch;
  _handler: BusListenerHanlder<T>;
  constructor(name: string, handler: BusListenerHanlder<T>, match?: TiMatch) {
    this._name = name;
    this._handler = handler;
    this._match = match ?? Match.parse(true);
  }

  toString(): string {
    let sb: string[] = [`@[${this._name}]`];
    if (_.isFunction(this._handler)) {
      sb.push("<handler>");
    } else {
      sb.push("<-NoHdl->");
    }
    if (this._match) {
      sb.push(":=>", this._match.explainText(Match.createExplainI18n()));
    }
    return sb.join(" ");
  }

  isMyHandler(handler: BusListenerHanlder<T>) {
    return this._handler === handler;
  }

  isMyEvent(msg: BusMsg<T>) {
    return this._match.test(msg);
  }

  process(msg: BusMsg<T>) {
    // console.log(`BUS:process: ${this._name} -> "${msg.name}"`);
    this._handler(msg);
  }
}

function name_is_conditional(name: string) {
  return name.startsWith("^") || /[?*+{}]/.test(name);
}

let BUS_NB = 0;

export class TiBusImpl<T> implements TiBus<T> {
  private _uniqKey: string;
  /**
   * ### 任意监听
   *
   * 监听任意事件，这里面的监听器，只要有事件来就一定会触发
   */
  private _lis_any: BusListener<T>[] = [];

  /**
   * ### 精确监听
   *
   * 监听一个指定的事件，精确匹配事件名称，这种监听会非常快速
   */
  private _lis_name: Map<string, BusListener<T>[]> = new Map();

  /**
   * ### 条件监听：
   *
   * 会逐个匹配监听器的匹配条件，匹配的上下文是:
   *
   * ```json5
   * {
   *    name: "form-changed",  // 事件的名称
   *    payload: <T>           // 事件的关联数据
   * } as BusMatchContext<T>
   * ```
   *
   */
  private _lis_match: BusListener<T>[] = [];

  /**
   * @param name 总线名称，默认为 'BUS'。
   *
   * @remarks
   * 构造函数，用于创建 TiBus 实例。
   * 每个实例都会被赋予一个唯一的 key，并存储在全局的 ALL_BUS Map 中。
   */
  constructor(name = "BUS") {
    this._uniqKey = `${name}-${BUS_NB++}`;

    let ALL_BUS = getEnv("ALL_BUS") as Map<string, TiBus<any>>;
    ALL_BUS.set(this._uniqKey, this);
  }

  toString(): string {
    let re: string[] = [`Bus<${this._uniqKey}>`];
    re.push("------------------");
    re.push(`Listen:any(${this._lis_any.length})`);
    this._lis_any.forEach((lis, index) => {
      re.push(`  - ${index}. ${lis.toString()}`);
    });
    re.push("------------------");
    re.push(`Listen:name(${this._lis_name.size})`);
    let index = 0;
    for (let [key, lis] of this._lis_name.entries()) {
      re.push(`  - ${index}. ${key} ${lis.toString()}`);
    }
    re.push("------------------");
    re.push(`Listen:match(${this._lis_match.length})`);
    this._lis_match.forEach((lis, index) => {
      re.push(`  - ${index}. ${lis.toString()}`);
    });

    return re.join("\n");
  }

  /**
   * 向总线发送一个消息，这是一个原始消息
   *
   * @param name 消息名称
   * @param payload 消息负载
   */
  emit(name: string, payload?: T) {
    this.send({
      srcBus: this._uniqKey,
      busPath: [],
      name,
      data: payload,
    });
  }

  /**
   * 向总线发送一个消息。总线之间的转发通常采用这个接口
   *
   * @param msg 消息对象
   */
  send(msg: BusMsg<T>) {
    // 防守: 为了防止消息在总线间无穷递归，只要是我发出的消息，我就不再发了
    if (msg.busPath.indexOf(this._uniqKey) >= 0) {
      console.warn(`Prevent Bus Msg Recursion: ${this._uniqKey}`, msg);
      return;
    }

    let name = msg.name;
    // 精确监听
    let listeners = _.concat(this._lis_name.get(name) || []);

    //任意监听
    listeners.push(...this._lis_any);

    // 条件监听
    for (let li of this._lis_match) {
      if (li.isMyEvent(msg)) {
        listeners.push(li);
      }
    }

    // 执行监听器: 执行前，记录自己到总线路径，防止无穷递归
    msg.busPath.push(this._uniqKey);
    for (let li of listeners) {
      li.process(msg);
    }
  }

  /**
   * 添加一个事件监听
   *
   * @param name 监听的事件名
   *
   * - `*` : 任意监听
   * - `^` 开头或者包括 `?*+{}` 等字符的 : 条件监听
   * - 否则就是精确监听
   *
   * @param handler 监听回调函数
   * @param deposer 注册注销行为
   */
  on(name: string, handler: BusListenerHanlder<T>, deposer?: BusDeposer) {
    // 任意监听
    if ("*" === name) {
      this.onAny(handler, deposer);
    }
    // 条件监听
    else if (name_is_conditional(name)) {
      this.onMatch(name, handler, deposer);
    }
    // 精确监听
    else {
      this.onName(name, handler, deposer);
    }
  }

  onAny(handler: BusListenerHanlder<T>, deposer?: BusDeposer) {
    this._lis_any.push(new BusListener("*", handler));
    if (deposer) {
      deposer(() => {
        this.offAny(handler);
      });
    }
  }

  onMatch(name: string, handler: BusListenerHanlder<T>, deposer?: BusDeposer) {
    let ma = Match.parse({ name });
    this._lis_match.push(new BusListener(name, handler, ma));
    if (deposer) {
      deposer(() => {
        this.offMatch(handler, name);
      });
    }
  }

  onName(name: string, handler: BusListenerHanlder<T>, deposer?: BusDeposer) {
    let listeners = this._lis_name.get(name);
    if (!listeners) {
      listeners = [];
      this._lis_name.set(name, listeners);
    }
    listeners.push(new BusListener(name, handler));
    if (deposer) {
      deposer(() => {
        this.offName(name, handler);
      });
    }
  }

  off(handler: BusListenerHanlder<T>, name?: string) {
    // 全部
    if (_.isUndefined(name)) {
      this.offAll(handler);
    }
    // 任意监听
    else if ("*" === name) {
      this.offAny(handler);
    }
    // 条件监听
    else if (name_is_conditional(name)) {
      this.offMatch(handler, name);
    }
    // 精确监听
    else {
      this.offName(name, handler);
    }
    //console.log(this.toString());
  }

  offAny(handler: BusListenerHanlder<T>) {
    // console.log("offAny");
    //_.remove(this._lis_any, (li) => li.isMyHandler(handler));
    this._lis_any = _.filter(this._lis_any, (li) => !li.isMyHandler(handler));
  }

  offMatch(handler: BusListenerHanlder<T>, name?: string) {
    //console.log("offMatch: name=", name);
    this._lis_match = _.filter(this._lis_match, (li) => {
      let is_match_name = _.isNil(name) || li._name == name;
      if (is_match_name && li.isMyHandler(handler)) {
        return false;
      }
      return true;
    });
    // if (!name) {
    //   _.remove(this._lis_match, (li) => li.isMyHandler(handler));
    // }
    // // 还要指定名称
    // else {
    //   _.remove(
    //     this._lis_match,
    //     (li) => name == li._name && li.isMyHandler(handler)
    //   );
    // }
  }

  offName(name: string, handler: BusListenerHanlder<T>) {
    //console.log("offName", name)
    let listeners = this._lis_name.get(name);
    if (listeners) {
      //console.log("before", listeners.length)
      let listeners2 = _.filter(listeners, (li) => !li.isMyHandler(handler));
      this._lis_name.set(name, listeners2);
      //_.remove(listeners, (li) => li.isMyHandler(handler));
      //console.log("after", listeners.length)
    }
  }

  offAll(handler: BusListenerHanlder<T>) {
    this.offAny(handler);
    this.offMatch(handler);
    for (let key of this._lis_name.keys()) {
      let listeners = this._lis_name.get(key);
      if (listeners) {
        let listeners2 = _.filter(listeners, (li) => !li.isMyHandler(handler));
        this._lis_name.set(key, listeners2);
        //_.remove(listeners, (li) => li.isMyHandler(handler));
      }
    }
  }

  depose() {
    let ALL_BUS = getEnv("ALL_BUS") as Map<string, TiBus<any>>;
    ALL_BUS.delete(this._uniqKey);
  }
}

export function createBus<T>(name?: string): TiBus<T> {
  return new TiBusImpl<T>(name);
}
