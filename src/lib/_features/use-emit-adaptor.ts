import _ from 'lodash';
import { Callback2, Tmpl, getLogger } from '../../core';

const log = getLogger('ti.use-emit-adaptor');

// 这个适配函数，接收捕获的事件以及事件参数，然后自行决定 emit 什么
export type CustomizedEmitAdaptor = (
  eventName: string,
  payload: any,
  emit: Callback2<string, any>
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

export type EmitAdaptorOptions = {
  ignoreNativeEvents?: boolean;
};

export function useEmitAdaptor(
  COM_TYPE: string,
  props: EmitAdaptorProps,
  emit: (event: string, payload: any) => void,
  options: EmitAdaptorOptions = {}
): Record<string, Function> {
  let { ignoreNativeEvents = true } = options;
  log.info(`useEmitAdaptor<${COM_TYPE}>`, _.cloneDeep(props.emitAdaptors));
  let listens = {} as Record<string, Function>;
  if (props.emitAdaptors) {
    for (let eventName of _.keys(props.emitAdaptors)) {
      let adaptEmit = props.emitAdaptors[eventName];
      // 字符串，就是修改一下事件的名称
      if (_.isString(adaptEmit)) {
        //.............<监听函数: String>.....................
        listens[eventName] = (payload: any) => {
          // 忽略原生事件
          if (ignoreNativeEvents) {
            if (payload instanceof Event) {
              payload.stopPropagation();
              return;
            }
          }
          // 路由事件名称
          log.debug(`👽<${COM_TYPE}>`, `String adaptEmit`, eventName, payload);
          let newEventName = Tmpl.exec(adaptEmit as string, {
            eventName,
            payload,
          });
          log.debug(`👽<${COM_TYPE}>`, 'newEventName =>', newEventName);
          emit(newEventName, payload);
        };
        //.............<监听函数: String>.....................
      }
      // 纯自定义
      else {
        //.............<监听函数: Customized>.................
        let customizedAdapt = adaptEmit as CustomizedEmitAdaptor;
        listens[eventName] = (payload: any) => {
          // 忽略原生事件
          if (ignoreNativeEvents) {
            if (payload instanceof Event) {
              payload.stopPropagation();
              return;
            }
          }
          log.debug(
            `👽<${COM_TYPE}>`,
            `Customized adaptEmit`,
            eventName,
            payload
          );
          customizedAdapt(eventName, payload, emit);
        };
        //.............<监听函数: Customized>.................
      }
    }
  }
  return listens;
}
