import _ from 'lodash';
import {
  CommonProps,
  TiAppBus,
  TiComInfo,
  TiEmit,
  TiEvent,
  TiEventTrigger,
} from '../../core';
import { TiUnkownInfo } from '../tile/unknown/ti-unknown-index';

export type BusEmitProps = Pick<CommonProps, 'emitMode'>;

export function useBusEmit<K extends string, T>(
  com: TiComInfo,
  props: BusEmitProps,
  emit: TiEmit<K, T>,
  bus?: TiAppBus
): TiEventTrigger<K, T> {
  return (name: K, payload?: T): void => {
    // 判断事件模式
    let { emitMode = 'auto' } = props;
    if ('auto' == emitMode) {
      emitMode = bus ? 'bus' : 'native';
    }
    // 准备事件对象
    let evt = makeEvent(com, name, payload);

    // 采用 Bus 通知
    if ('bus' == emitMode) {
      bus?.emit(name, evt);
    }
    // 采用原生 emit 通知
    else if ('native' == emitMode) {
      emit(name, evt);
    } else if ('both' == emitMode) {
      emit(name, evt);
      bus?.emit(name, evt);
    }
  };
}

export function makeEvent<K extends string, T>(
  com: TiComInfo,
  name: K,
  payload?: T
): TiEvent<T> {
  return {
    created: new Date(),
    sourceCom: _.pick(com, 'name', 'race', 'text', 'i18n', 'exampleModel'),
    name,
    // TODO 或许以后可以加入调用控件的实例路径
    // 获取控件实例的方法，可以提供一个全局特性
    payload,
  };
}

export function makeAnonymouseEvent<K extends string, T>(
  name: K,
  payload?: T
): TiEvent<T> {
  return {
    created: new Date(),
    sourceCom: TiUnkownInfo,
    name,
    // TODO 或许以后可以加入调用控件的实例路径
    // 获取控件实例的方法，可以提供一个全局特性
    payload,
  };
}
