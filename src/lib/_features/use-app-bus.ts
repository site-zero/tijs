import { createBus, setEnv } from '../../core';
import { AppEvents, TiAppBus, TiAppEvent } from '../';
import { makeAnonymouseEvent } from './use-bus-emit';

type BusDeposeCallback = (hook: () => any) => false | Function | undefined;

export function createAppBus(deposer: BusDeposeCallback) {
  let bus = createBus<TiAppEvent>();
  setEnv('BUS', bus);
  bus.on('*', (msg) => {
    console.log('总线收到消息', msg);
  });
  bus.on('playground:click-suffix-text', (v) => {
    console.log('哈哈哈', v);
  });
  deposer(() => {
    bus.depose();
  });
  return bus;
}

export function createAppSubBus(
  bus: TiAppBus,
  name: string,
  deposer: BusDeposeCallback,
) {
  let sub = bus.createSubBus(name, [
    AppEvents.APP_RESIZE,
    AppEvents.APP_SCROLL,
  ]);
  deposer(() => {
    sub.depose();
  });
  return sub;
}

export function watchAppResize(bus: TiAppBus, win = window) {
  win.addEventListener('resize', () => {
    let evt = makeAnonymouseEvent(AppEvents.APP_RESIZE);
    bus.emit(evt.name, evt);
  });
}
