import _ from 'lodash';
import { EmitAdaptorHandler, EmitAdaptorProps } from '../../_type';
import { Tmpl } from '../../core';

import { getLogger } from '../../core/log/ti-log';

const log = getLogger('ti.use-emit-adaptor');

export type EmitAdaptorOptions = {
  ignoreNativeEvents?: boolean;
  handler?: EmitAdaptorHandler;
};

export function useEmitAdaptor(
  COM_TYPE: string,
  props: EmitAdaptorProps,
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
          if (options.handler) {
            options.handler({
              eventName: newEventName,
              orginName: eventName,
              data: payload,
            });
          }
          // 警告一下
          else {
          }
        };
        //.............<监听函数: String>.....................
      }
      // 纯自定义
      else {
        //.............<监听函数: Customized>.................
        let customizedAdapt = adaptEmit as EmitAdaptorHandler;
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
          customizedAdapt({
            eventName: eventName,
            orginName: eventName,
            data: payload,
          });
        };
        //.............<监听函数: Customized>.................
      }
    }
  }
  return listens;
}
