import _ from 'lodash';
import { createApp } from 'vue';
import { AppModalInitProps, AppModalProps, Dom, EleOptions } from '..';
import TiAppModal from './TiAppModal.vue';

export async function openAppModal(props: AppModalProps): Promise<any> {
  // 创建对应的 mask 容器元素
  let wrapperElment = {
    tagName: 'div',
    className: 'app-modal-wrapper',
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
    },
    $p: document.body,
  } as EleOptions;
  let $gasket = Dom.createElement(wrapperElment);

  return new Promise<any>((_resolve, _reject) => {
    function returnValue(re?: any) {
      if (_.isUndefined(re)) {
        _resolve(undefined);
      } else {
        let reo = _.cloneDeep(re);
        _resolve(reo);
      }
    }
    function releaseDom() {
      app.unmount();
      Dom.remove($gasket);
    }

    // 使用 app 映射到元素
    let app = createApp(TiAppModal, {
      ...props,
      returnValue,
      releaseDom,
    } as AppModalInitProps);
    app.mount($gasket);

    // 关闭对话框时，也移除创建的元素
    //app.unmount();
  });
}
