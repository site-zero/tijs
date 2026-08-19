import _ from "lodash";
import {
  AppModelActionHandler,
  AppModelBindingData,
  AppModelBindingEvent,
  isArray,
  Vars,
} from "../../_type";

const debug = false;

/**
 * 通常这个函数会被用到计算属性里。 它会生产一个控件的属性表
 *
 * @param binding 绑定关系
 * @param getResult 获取结果对象
 */
export function makeAppModelDataProps(
  bindingData: AppModelBindingData,
  getResult: () => any
): Record<string, any> {
  if (debug) console.log("bindingData=", bindingData);
  let props = {} as Record<string, any>;
  // 1. `null` 不传递
  if (!bindingData) {
    if (debug) console.log("null => {}");
    return props;
  }
  let result = getResult();
  // 2. `"value"` 【默认】将 result 传递给 value 属性
  if (_.isString(bindingData)) {
    if (debug) console.log(`string => props[${bindingData}] = result;`);
    props[bindingData] = _.cloneDeep(result);
  }
  // 3. `["a","b"] 将 result.a 传递给 a 属性，result.b 传递给 b 属性
  else if (_.isArray(bindingData)) {
    if (debug) console.log("array => ...");
    for (let key of bindingData) {
      props[key] = _.get(result, key);
    }
  }
  // 4. `{a:"x",b:"y"}` 将 result.a 传递给 x 属性，result.b 传递给 y 属性
  else {
    if (debug) console.log("mapping => ...");
    for (let fromKey of _.keys(bindingData)) {
      let toKey = bindingData[fromKey];
      props[toKey] = _.get(result, fromKey);
    }
  }
  if (debug) console.log("props=", props);
  return props;
}

export type MakeAppModelEventListenerOption = {
  COM_TYPE: string;
  convertResult?: (result: any) => Promise<any>;
  setResult: (result: any) => Promise<void>;
  assignResult: (meta: any) => Promise<void>;
  bindingEvent?: AppModelBindingEvent;
};

/**
 * 通常这个函数会被用到计算属性里。 它会生产一个动态事件监听记录表
 * 调用者可以直接将这个监听表设置到 `v-on` 属性里，
 * 这样，控件的的事件参数，就会传递给 result 对象了
 *
 * @param bindingEvent 绑定关系
 * @param result 结果对象的引用对象（响应式）
 */
export function makeAppModelEventListeners(
  options: MakeAppModelEventListenerOption
): Record<string, AppModelActionHandler> {
  let { COM_TYPE, convertResult, setResult, assignResult, bindingEvent } =
    options;
  //console.log(COM_TYPE, bindingEvent, result);
  if (debug) console.log("listenResult:", COM_TYPE, bindingEvent, setResult);
  let listeners = {} as Record<string, AppModelActionHandler>;
  // 1. `null` 不传递
  if (!bindingEvent) {
    return listeners;
  }
  // 2. `"change"` 【默认】将 change 事件的 payload 设置为 result
  // 3. "select.checkedId" 将 select 事件的 payload 中的 checkedIds 设置为 result
  if (_.isString(bindingEvent)) {
    if (debug) console.log(`'${bindingEvent}' => result`);
    // 带有路径
    let pos = bindingEvent.indexOf(".");
    if (pos > 0) {
      let eventName = bindingEvent.substring(0, pos);
      let path = bindingEvent.substring(pos + 1);
      listeners[eventName] = async (_api, payload: any) => {
        if (debug)
          console.log(`🎃<${COM_TYPE}>`, eventName, `(${path}) = `, payload);
        let re = convertResult ? await convertResult(payload) : payload;
        let eventData = _.get(re, path);
        await setResult(eventData);
      };
    }
    // 简单
    else {
      listeners[bindingEvent] = async (_api, payload: any) => {
        if (debug) console.log(`🎃<${COM_TYPE}>`, bindingEvent, "=", payload);
        let re = convertResult ? await convertResult(payload) : payload;
        await setResult(re);
      };
    }
  }
  // 动态多重监听
  else {
    for (let eventName of _.keys(bindingEvent)) {
      let handler = bindingEvent[eventName];
      // 6. `{change: (api, payload) => { ... }}` 自定义设置 result 的方法
      if (_.isFunction(handler)) {
        listeners[eventName] = handler;
      }
      // 4. `{change:["a","b"]}`
      //     将 change 事件的 payload.a =>result.a,payload.b => result.b
      else if (isArray<string>(handler)) {
        if (debug) console.log(`{change:["a","b"]}`);
        let asKeys = handler as string[];
        listeners[eventName] = async (_api, payload: any) => {
          if (debug)
            console.log(
              `🎃<${COM_TYPE}>`,
              eventName,
              `handler=${JSON.stringify(asKeys)}`,
              "=",
              payload
            );
          let re = convertResult ? await convertResult(payload) : payload;
          let meta = _.pick(re, ...asKeys);
          await assignResult(meta);
        };
      }
      // 5. `{change:{a:"x",b:"y"}}`
      //     将 change 事件的 payload.a =>result.x,payload.b => result.y
      else {
        if (debug) console.log(`{change:{a:"x",b:"y"}}`);
        let asMapping = handler as Record<string, string>;
        listeners[eventName] = async (_api, payload: any) => {
          let meta: Vars = {};
          if (debug)
            console.log(
              `🎃<${COM_TYPE}>`,
              eventName,
              `handler=${JSON.stringify(asMapping)}`,
              "=",
              payload
            );
          let re = convertResult ? await convertResult(payload) : payload;
          for (let fromKey of _.keys(asMapping)) {
            let toKey = asMapping[fromKey];
            let val = _.get(re, fromKey);
            _.set(meta, toKey, val);
          }
          await assignResult(meta);
        };
      }
    }
  }
  if (debug) console.log("listeners=", listeners);
  return listeners;
}

/**
 * 获取绑定关系事件监听名称的列表
 *
 * @param bindingEvent 绑定关系
 * @return 监听事件名称的列表
 */
export function getAppModelListenEvents(
  bindingEvent?: AppModelBindingEvent
): string[] {
  // 1. `null` 不传递
  if (!bindingEvent) {
    return [];
  }
  // 2. `"change"` 【默认】将 change 事件的 payload 设置为 result
  // 3. "select.checkedId" 将 select 事件的 payload 中的 checkedIds 设置为 result
  if (_.isString(bindingEvent)) {
    let pos = bindingEvent.indexOf(".");
    if (pos > 0) {
      let eventName = bindingEvent.substring(0, pos);
      return [eventName];
    }
    return [bindingEvent];
  }
  // 动态多重监听
  return _.keys(bindingEvent);
}
