import { App, ObjectPlugin } from 'vue';

export function createTi(): ObjectPlugin<any[]> {
  return {
    install: (_app: App): void => {
      // TODO 貌似没有什么可定制的 ...
    },
  };
}
