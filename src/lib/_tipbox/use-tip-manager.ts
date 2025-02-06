import _ from 'lodash';
import { AppTipSetApi, useAppTipSet } from './use-app-tipset';
import { drawTipBox } from './use-tip-box';

const _appsets = new Map<string, AppTipSetApi>();
let _app_seq = 0;

export type TipManagerApi = ReturnType<typeof useTipManager>;
export type GetTipOptions = {
  id: string;
  comId?: string;
  appId?: string;
};

export function useTipManager() {
  function getAppTipSets() {
    return _appsets;
  }

  function getAppTipSetApi(appSetId: string) {
    return _appsets.get(appSetId);
  }

  function createAppTipSet(scope: HTMLElement) {
    let appSetId = `App-${_app_seq++}`;
    let tipset = useAppTipSet({ appId: appSetId, scope });
    _appsets.set(appSetId, tipset);
    return tipset;
  }

  function getTipByElement(src: HTMLElement) {
    for (let [__, tipsets] of _appsets) {
      let re = tipsets.getTipByElement(src);
      if (re) {
        return re;
      }
    }
  }

  function getTip(options: GetTipOptions | string) {
    let input: GetTipOptions;
    if (_.isString(options)) {
      input = { id: options };
    } else {
      input = options;
    }

    let { id, comId, appId } = input;
    // 限定了在某个 APP 里查找
    if (appId) {
      let app = _appsets.get(appId);
      if (!app) {
        return;
      }
      // 在 APP 里的某个组件里查找
      if (comId) {
        let com = app.getTipSet(comId);
        if (!com) {
          return;
        }
        return com.getTip(id);
      }
      // 全 app 里查找
      return app.getTip(id);
    }
    // 虽然没有限定 app 但是限定了 com
    else if (comId) {
      for (let [__, tipsets] of _appsets) {
        let com = tipsets.getTipSet(comId);
        if (com) {
          return com.getTip(id);
        }
      }
    }

    // 最后全局查
    for (let [__, tipsets] of _appsets) {
      let re = tipsets.getTip(id);
      if (re) {
        return re;
      }
    }
  }

  function watchDocumentBody() {
    if (document.body.getAttribute('tip-watched')) {
      return;
    }
    document.body.addEventListener('mouseover', (ev) => {
      let src = ev.target as HTMLElement;
      let tip = getTipByElement(src);
      //console.log('mouseenter', src.tagName);
      if (tip) {
        drawTipBox(tip);
      }
    });
    document.body.setAttribute('tip-watched', 'yes');
  }

  // 输出特性
  return {
    _appsets,
    getAppTipSets,
    getAppTipSetApi,
    createAppTipSet,
    getTip,
    watchDocumentBody,
  };
}
