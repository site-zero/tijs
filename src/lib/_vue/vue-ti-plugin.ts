import { App, ObjectPlugin } from 'vue';

export function createTi(): ObjectPlugin<any[]> {
  return {
    install: (_app: App): void => {},
  };
}
