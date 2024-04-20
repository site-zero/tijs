import _ from 'lodash';
import { Callback2 } from '../../core';

export type EmitAdaptor =
  | string
  | {
      // 这个适配函数，接收捕获的事件以及事件参数，然后自行决定 emit 什么
      (eventName: string, args: any[], emit: Callback2<string, any>): void;
    };

export type EmitAdaptorProps = {
  emitAdaptor?: Record<string, EmitAdaptor>;
};

export function useEmitAdaptor(
  props: EmitAdaptorProps,
  emit: (event: string, payload: any) => void
): Record<string, Function> {
  let listens = {} as Record<string, Function>;
  if (props.emitAdaptor) {
    for (let eventName of _.keys(props.emitAdaptor)) {
      let ea = props.emitAdaptor[eventName];
      // 字符串，就是修改一下事件的名称
      if (_.isString(ea)) {
        listens[eventName] = (...args: any[]) => {
            
        };
      }
      // 纯自定义
      else {
      }
    }
  }
  return listens;
}
