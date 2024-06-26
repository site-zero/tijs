import { AppEvents, TiAppBus } from '../../_type';
import { createBus, setEnv } from '../../core';

type BusDeposeCallback = (hook: () => void) => void;

export function createAppBus(deposer: BusDeposeCallback) {
  let bus = createBus<any>();
  setEnv('BUS', bus);
  deposer(() => {
    setEnv('BUS', null);
    bus.depose();
  });
  return bus;
}

// export function createAppSubBus(
//   bus: TiAppBus,
//   name: string,
//   deposer: BusDeposeCallback
// ) {
//   let sub = bus.createSubBus(name, [
//     AppEvents.APP_RESIZE,
//     AppEvents.APP_SCROLL,
//   ]);
//   deposer(() => {
//     sub.depose();
//   });
//   return sub;
// }

export function watchAppResize(bus: TiAppBus, win = window) {
  win.addEventListener('resize', () => {
    bus.emit(AppEvents.APP_RESIZE, undefined);
  });
}
