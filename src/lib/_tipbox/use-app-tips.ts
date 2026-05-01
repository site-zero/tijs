import _ from "lodash";
import { Point2D } from "../../_type";
import { Rects } from "../../core";
import { TipInstance } from "./lib-tip-types";
import { drawTipBox, eraseTip } from "./use-tip-box";
import { useTipsApi } from "./use-tips-api";

const debug = false;

export function useTipsWatcher() {
  const _api = useTipsApi();
  const _pointer: Point2D = { x: -1, y: -1 };

  function watchDocumentForTips($body = document.body) {
    if (document.body.getAttribute("tips-watched")) {
      return;
    }
    $body.addEventListener("mouseover", (ev) => {
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
      let target = _api.getTipTargetElement(src);
      if (debug) console.log(_pointer, "target", target);
      // 没有 target
      if (!target) {
        return;
      }
      if ((target as any).__tip_obj) {
        if (debug)
          console.warn("Already has __tip_obj", (target as any).__tip_obj);
        return;
      }
      let tip = _api.loadTipFromElement(target);
      if (debug) console.log("_api.loadTipFromElement", tip);
      if (tip) {
        // 看看是否需要限制修饰键
        if (!_.isEmpty(tip.modifier)) {
          if (!_api.isMatchModifier(ev, tip.modifier)) {
            if (debug) console.log("未匹配修饰键", tip.modifier);
            return;
          }
        }
        // 延迟多长时间显示
        let delayInMs = tip.delay || 800;
        if (_.isNumber(delayInMs)) {
          // 如果指定了修饰键，那么就不需要延迟了
          // 按着 ctrl 键，你当然是想要立刻看到提示了
          delayInMs = tip.modifier ? 0 : 800;
        }
        if (debug) console.log("delayInMs:", delayInMs);
        // 绘制 Tip
        _.delay(() => {
          // 再次确认，鼠标在目标区域里，那么就需要显示提示
          if (!target) {
            if (debug) console.warn(`delay(${delayInMs}) !target`, target);
            return;
          }
          if ((target as any).__tip_obj) {
            if (debug)
              console.warn(
                `delay(${delayInMs}) Already has __tip_obj`,
                (target as any).__tip_obj
              );
            return;
          }

          let rect = Rects.createBy(target);
          if (debug) console.warn(`delay(${delayInMs}) rect:`, rect);

          if (!rect.hasPoint(_pointer)) {
            if (debug)
              console.warn(
                `delay(${delayInMs}) !rect.hasPoint(x=${_pointer.x},y=${_pointer.y})`,
                rect.toString()
              );
            return;
          }

          // 确认了，那么需要绘制 Tip
          let tipObj = drawTipBox(_api, tip, target);
          if (debug) console.warn(`delay(${delayInMs}) drawTipBox:`, tipObj);

          if (tipObj) {
            _api.addInstance(tipObj);
            (target as any).__tip_obj = tipObj;
          }
        }, delayInMs);
      }
    });
    document.body.setAttribute("tips-watched", "yes");
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

export function getAppTipsApi() {
  return TI_APP_TIPS.api;
}
