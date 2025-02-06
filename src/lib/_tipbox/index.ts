import { useTipManager } from './use-tip-manager';

export * from './lib-tip-types';
export * from './use-app-tipset';
export * from './use-com-tips';
export * from './use-tip-manager';

export function getTipManager() {
  return useTipManager();
}
