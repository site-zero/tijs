import { ref } from 'vue';
import { Dom } from '../../core';
import { ComTipsApi, useComTips, UseComTipsOptions } from './use-com-tips';

export type AppTipSetApi = ReturnType<typeof useAppTipSet>;

export type UseAppTipSetOptions = {
  /**
   * 必须指定一个 APP ID，通常它由 TipManager 来分配
   */
  appId: string;

  scope: HTMLElement;
};

export function useAppTipSet(options: UseAppTipSetOptions) {
  const _comsets = new Map<string, ComTipsApi>();
  const _app_id = options.appId;
  let _seq = 0;
  let _scope = ref<HTMLElement>(options.scope);

  function createComTips(
    options: Omit<UseComTipsOptions, 'appId' | 'comId' | 'remove'>
  ) {
    let comId = `Com-${_seq++}`;
    let tips = useComTips({
      ...options,
      appId: _app_id,
      comId: comId,
      remove: function (setId: string) {
        _comsets.delete(setId);
      },
    });
    _comsets.set(comId, tips);

    return tips;
  }

  function getTipByElement(src: HTMLElement) {
    // 不再我的范围里，就退出处理了
    let inScope = Dom.inScope(src, _scope.value);
    if (!inScope) {
      return;
    }
    for (let [__, tips] of _comsets) {
      let re = tips.getTipByElement(src);
      if (re) {
        return re;
      }
    }
  }

  function getTipSet(comId: string) {
    return _comsets.get(comId);
  }

  function getTip(id: string) {
    for (let [__, tips] of _comsets) {
      let re = tips.getTip(id);
      if (re) {
        return re;
      }
    }
  }

  // 输出特性
  return {
    _comsets,
    appId: options.appId,
    getTipSet,
    getTip,
    scope: options.scope,
    createComTips,
    getTipByElement,
  };
}
