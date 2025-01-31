import _ from 'lodash';
import { EmitAdaptorHandler, EmitAdaptorProps } from '../../_type';
import { Tmpl } from '../../core';

const debug = false;

export type EmitAdaptorOptions = {
  ignoreNativeEvents?: boolean;
  handler?: EmitAdaptorHandler;
};

export function useEmitAdaptor(
  COM_TYPE: string,
  props: EmitAdaptorProps,
  options: EmitAdaptorOptions = {}
): Record<string, Function> {
  //console.log('-----------useEmitAdaptor', _.get(props, 'name'), props.emitAdaptors);
  let { ignoreNativeEvents = true } = options;
  if (debug)
    console.log(`useEmitAdaptor<${COM_TYPE}>`, _.cloneDeep(props.events));
  let listens = {} as Record<string, Function>;
  if (props.events) {
    for (let eventName of _.keys(props.events)) {
      let adaptEmit = props.events[eventName];
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
          if (debug)
            console.log(
              `👽<${COM_TYPE}>`,
              `String adaptEmit`,
              eventName,
              payload
            );
          let newEventName = Tmpl.exec(adaptEmit as string, {
            eventName,
            payload,
          });
          if (debug)
            console.log(`👽<${COM_TYPE}>`, 'newEventName =>', newEventName);
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
          if (debug)
            console.log(
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
