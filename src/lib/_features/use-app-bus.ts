import { AppEvents, TiAppBus, createBus, setEnv } from '../../core';

type BusDeposeCallback = (hook: () => any) => false | Function | undefined;

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
