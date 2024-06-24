import _ from 'lodash';
import { Ref } from 'vue';
import {
  AppModelBindingData,
  AppModelBindingEvent,
  Callback1,
  isArray,
} from '../../_type';
import { getLogger } from '../../core/log/ti-log';

const log = getLogger('ti.use-app-model-binding');

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
  log.debug('bindingData=', bindingData);
  let props = {} as Record<string, any>;
  // 1. `null` 不传递
  if (!bindingData) {
    log.debug('null => {}');
    return props;
  }
  let result = getResult();
  // 2. `"value"` 【默认】将 result 传递给 value 属性
  if (_.isString(bindingData)) {
    log.debug('string => props[bindingData] = result;');
    props[bindingData] = _.cloneDeep(result);
  }
  // 3. `["a","b"] 将 result.a 传递给 a 属性，result.b 传递给 b 属性
  else if (_.isArray(bindingData)) {
    log.debug('array => ...');
    for (let key of bindingData) {
      props[key] = _.get(result, key);
    }
  }
  // 4. `{a:"x",b:"y"}` 将 result.a 传递给 x 属性，result.b 传递给 y 属性
  else {
    log.debug('mapping => ...');
    for (let fromKey of _.keys(bindingData)) {
      let toKey = bindingData[fromKey];
      props[toKey] = _.get(result, fromKey);
    }
  }
  log.debug('props=', props);
  return props;
}

/**
 * 通常这个函数会被用到计算属性里。 它会生产一个动态事件监听记录表
 * 调用者可以直接将这个监听表设置到 `v-on` 属性里，
 * 这样，控件的的事件参数，就会传递给 result 对象了
 *
 * @param bindingEvent 绑定关系
 * @param result 结果对象的引用对象（响应式）
 */
export function makeAppModelEventListeners(
  COM_TYPE: string,
  bindingEvent: AppModelBindingEvent,
  result: Ref<any>
): Record<string, Callback1<any>> {
  let listeners = {} as Record<string, Callback1<any>>;
  // 1. `null` 不传递
  if (!bindingEvent) {
    return listeners;
  }
  // 2. `"change"` 【默认】将 change 事件的 payload 设置为 result
  if (_.isString(bindingEvent)) {
    listeners[bindingEvent] = (payload: any) => {
      log.debug(`🎃<${COM_TYPE}>`, bindingEvent, '=', payload);
      result.value = payload;
    };
  }
  // 动态多重监听
  else {
    for (let eventName of _.keys(bindingEvent)) {
      let handler = bindingEvent[eventName];
      // 3. `{change:["a","b"]}`
      //     将 change 事件的 payload.a =>result.a,payload.b => result.b
      if (isArray<string>(handler)) {
        let asKeys = handler as string[];
        listeners[eventName] = (payload: any) => {
          log.debug(
            `🎃<${COM_TYPE}>`,
            eventName,
            `handler=${JSON.stringify(asKeys)}`,
            '=',
            payload
          );
          let meta = _.pick(payload, ...asKeys);
          _.assign(result.value, meta);
        };
      }
      // 4. `{change:{a:"x",b:"y"}}`
      //     将 change 事件的 payload.a =>result.x,payload.b => result.y
      else {
        let asMapping = handler as Record<string, string>;
        listeners[eventName] = (payload: any) => {
          log.debug(
            `🎃<${COM_TYPE}>`,
            eventName,
            `handler=${JSON.stringify(asMapping)}`,
            '=',
            payload
          );
          for (let fromKey of _.keys(asMapping)) {
            let toKey = asMapping[fromKey];
            let val = _.get(payload, fromKey);
            _.set(result.value, toKey, val);
          }
        };
      }
    }
  }
  return listeners;
}

/**
 * 获取绑定关系事件监听名称的列表
 *
 * @param bindingEvent 绑定关系
 * @return 监听事件名称的列表
 */
export function getAppModelListenEvents(
  bindingEvent: AppModelBindingEvent
): string[] {
  // 1. `null` 不传递
  if (!bindingEvent) {
    return [];
  }
  // 2. `"change"` 【默认】将 change 事件的 payload 设置为 result
  if (_.isString(bindingEvent)) {
    return [bindingEvent];
  }
  // 动态多重监听
  return _.keys(bindingEvent);
}
