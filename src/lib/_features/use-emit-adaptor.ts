import _ from 'lodash';
import {
  CustomizedEmitAdaptor,
  EmitAdaptorProps,
  Tmpl,
  getLogger,
} from '../../core';

const log = getLogger('ti.use-emit-adaptor');

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
