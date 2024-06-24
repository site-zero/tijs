import { App, ObjectPlugin } from 'vue';
import { PopPosition, TranName } from '../../_type';

export function positionToTransName(pos: PopPosition): TranName {
  return {
    'left': 'ti-slide-left',
    'right': 'ti-slide-right',
    'top': 'ti-slide-up',
    'bottom': 'ti-slide-down',
    'center': 'ti-zoom',
    'free': 'ti-zoom',
    'left-top': 'ti-zoom',
    'right-top': 'ti-zoom',
    'bottom-left': 'ti-zoom',
    'bottom-right': 'ti-zoom',
  }[pos] as TranName;
}

export function createTi(): ObjectPlugin<any[]> {
  return {
    install: (_app: App): void => {
      // TODO 貌似没有什么可定制的 ...
    },
  };
}
