import _ from 'lodash';
import { Match, TiMatch, getEnv } from '../ti';

export type BusMsg<T> = {
  /**
   * 消息发源自哪个 bus
   */
  srcBus: string;
  /**
   * 消息流经的 bus
   */
  busPath: string[];
  /**
   * 消息的名称
   */
  name: string;
  /**
   * 消息的数据
   */
  data: T;
};

export type BusListenerHanlder<T> = {
  (msg: BusMsg<T>): void;
};

class BusListener<T> {
  _name: string;
  _match: TiMatch;
  _handler: BusListenerHanlder<T>;
  constructor(name: string, handler: BusListenerHanlder<T>, match?: TiMatch) {
    this._name = name;
    this._handler = handler;
    this._match = match ?? Match.parse(true);
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
  return name.startsWith('^') || /[?*+{}]/.test(name);
}

let BUS_NB = 0;

export class TiBus<T> {
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
   * 如果链接了一个父 BUS，那么一定会创建一个适配函数
   */
  private _bus_adaptor?: BusListenerHanlder<T>;

  private _src_bus?: TiBus<T>;

  constructor(name = 'BUS') {
    this._uniqKey = `${name}-${BUS_NB++}`;

    let ALL_BUS = getEnv('ALL_BUS') as Map<string, TiBus<any>>;
    ALL_BUS.set(this._uniqKey, this);
  }

  /**
   * 创建一个与自己关联的子总线
   *
   * @param name 总线名称
   * @param eventNames 要关联的事件名
   * @param adaptor 与子总线的适配方式
   * @returns  子总线
   */
  createSubBus(
    name: string,
    eventNames?: string[],
    adaptor?: BusListenerHanlder<T>
  ): TiBus<T> {
    let subBus = new TiBus<T>(name);
    subBus.connectTo(this, eventNames, adaptor);
    return subBus;
  }

  /**
   * 将自己连接到一个源总线，并将该总线的事件转发到本总线
   *
   * @param srcBus 父总线
   * @param eventNames 要关联的事件名
   * @param adaptor 与子总线的适配方式
   */
  connectTo(
    srcBus: TiBus<T>,
    eventNames?: string[],
    adaptor?: BusListenerHanlder<T>
  ) {
    // 一定要断开连接
    this.tryDisconnect();

    // 尝试连接到新的父总线
    if (adaptor) {
      this._bus_adaptor = adaptor;
    }
    // 采用默认适配逻辑
    else {
      this._bus_adaptor = (msg: BusMsg<T>) => {
        //console.log("_bus_adaptor", this._uniqKey);
        this.send(msg);
      };
    }
    this._src_bus = srcBus;
    // 适配全部消息
    if (!eventNames || eventNames.length == 0) {
      srcBus.onAny(this._bus_adaptor);
    }
    // 连接有限事件
    else {
      for (let eventName of eventNames) {
        srcBus.on(eventName, this._bus_adaptor);
      }
    }
  }

  /**
   * 如果连接了父总线，就断开连接
   */
  tryDisconnect() {
    if (this._src_bus && this._bus_adaptor) {
      this._src_bus.off(this._bus_adaptor);
    }
    this._src_bus = undefined;
    this._bus_adaptor = undefined;
  }

  /**
   * 向总线发送一个消息，这是一个原始消息
   *
   * @param name 消息名称
   * @param payload 消息负载
   */
  emit(name: string, payload: T) {
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
   */
  on(name: string, handler: BusListenerHanlder<T>) {
    // 任意监听
    if ('*' === name) {
      this.onAny(handler);
    }
    // 条件监听
    else if (name_is_conditional(name)) {
      this.onMatch(name, handler);
    }
    // 精确监听
    else {
      this.onName(name, handler);
    }
  }

  onAny(handler: BusListenerHanlder<T>) {
    this._lis_any.push(new BusListener('*', handler));
  }

  onMatch(name: string, handler: BusListenerHanlder<T>) {
    let ma = Match.parse({ name });
    this._lis_match.push(new BusListener(name, handler, ma));
  }

  onName(name: string, handler: BusListenerHanlder<T>) {
    let listeners = this._lis_name.get(name);
    if (!listeners) {
      listeners = [];
      this._lis_name.set(name, listeners);
    }
    listeners.push(new BusListener(name, handler));
  }

  off(handler: BusListenerHanlder<T>, name?: string) {
    // 全部
    if (_.isUndefined(name)) {
      this.offAll(handler);
    }
    // 任意监听
    else if ('*' === name) {
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
  }

  offAny(handler: BusListenerHanlder<T>) {
    // console.log("offAny");
    _.remove(this._lis_any, (li) => li.isMyHandler(handler));
  }

  offMatch(handler: BusListenerHanlder<T>, name?: string) {
    // console.log("offMatch");
    if (!name) {
      _.remove(this._lis_match, (li) => li.isMyHandler(handler));
    }
    // 还要指定名称
    else {
      _.remove(
        this._lis_match,
        (li) => name == li._name && li.isMyHandler(handler)
      );
    }
  }

  offName(name: string, handler: BusListenerHanlder<T>) {
    //console.log("offName", name)
    let listeners = this._lis_name.get(name);
    if (listeners) {
      //console.log("before", listeners.length)
      _.remove(listeners, (li) => li.isMyHandler(handler));
      //console.log("after", listeners.length)
    }
  }

  offAll(handler: BusListenerHanlder<T>) {
    this.offAny(handler);
    this.offMatch(handler);
    for (let key of this._lis_name.keys()) {
      let listeners = this._lis_name.get(key);
      if (listeners) {
        _.remove(listeners, (li) => li.isMyHandler(handler));
      }
    }
  }

  depose() {
    this.tryDisconnect();
    let ALL_BUS = getEnv('ALL_BUS') as Map<string, TiBus<any>>;
    ALL_BUS.delete(this._uniqKey);
  }
}

export function createBus<T>(name?: string): TiBus<T> {
  return new TiBus<T>(name);
}
