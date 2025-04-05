import _ from 'lodash';
import { Point2D } from '../../_type';
import { TipInstance } from './lib-tip-types';
import { drawTipBox, eraseTip } from './use-tip-box';
import { useTipsApi } from './use-tips';

export function useTipsWatcher() {
  const _api = useTipsApi();
  const _pointer: Point2D = { x: -1, y: -1 };

  function watchDocumentForTips($body = document.body) {
    if (document.body.getAttribute('tips-watched')) {
      return;
    }
    $body.addEventListener('mouseover', (ev) => {
      // 实时保存鼠标位置，以便延迟取消 tip 时进行判断
      _pointer.x = ev.pageX;
      _pointer.y = ev.pageY;

      // 释放已有的 tips
      let list = _api.findTipsNeedToErase(_pointer);
      for (let li of list) {
        _.delay(() => {
          tryEraseTip(li);
        }, 300);
      }

      // 看看是否要开启新的 tips
      let src = ev.target as HTMLElement;
      // 已经有了 Tip
      if ((src as any).__tip_obj) {
        return;
      }
      let tip = _api.getTipBoxPropxByElement(src);
      if (tip) {
        // 看看是否需要限制修饰键
        if (!_.isEmpty(tip.modifier)) {
          if (!_api.isMatchModifier(ev, tip.modifier)) {
            return;
          }
        }
        // 绘制 Tip
        let tipObj = drawTipBox(tip, src);
        if (tipObj) {
          _api.addInstance(tipObj);
          (src as any).__tip_obj = tipObj;
        }
      }
    });
    document.body.setAttribute('tips-watched', 'yes');
  }

  function tryEraseTip(tipObj: TipInstance) {
    // 再次确认，提示信息可以被删除
    if (tipObj.box.hasPoint(_pointer) || tipObj.ref.hasPoint(_pointer)) {
      return;
    }

    // 执行删除 Tip
    eraseTip(tipObj);
  }

  // -----------------------------------------------------
  // 返回特性
  // -----------------------------------------------------
  return {
    api: _api,
    watchDocumentForTips,
  };
}

export const TI_APP_TIPS = useTipsWatcher();
