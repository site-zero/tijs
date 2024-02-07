import { App } from 'vue';
import { I18n } from '../../core';

export function createTi() {
  return {
    install(app: App<Element>): void {
      app.config.globalProperties.$i18n = (
        key?: string,
        dftKey?: string,
      ): string | undefined => {
        if (!key) {
          return;
        }
        return I18n.textOrKey(key, dftKey);
      };
    },
  };
}
