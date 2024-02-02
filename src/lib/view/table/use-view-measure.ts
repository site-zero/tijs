import { Callback, Callback1, FuncA0, Rects, Size2D } from "../../../core";
import { AppEvents, TiAppBus } from "../../";
import _ from "lodash";
import { nextTick } from "vue";

export type ViewMeasureProps = {
  getMainElement: FuncA0<HTMLElement | undefined>;
  setViewport: Callback1<Size2D>;
  setScrollTop?: Callback1<number>;
  onMounted?: Callback1<Callback>;
  onUnmounted?: Callback1<Callback>;
  GBus?: TiAppBus;
  debounce?: number;
};

/**
 * 需要在 mounted 之后调用
 *
 * @param props 传入属性
 * @returns
 */
export function useViewMeasure(props: ViewMeasureProps) {
  let {
    getMainElement,
    setViewport,
    setScrollTop,
    onMounted,
    onUnmounted,
    GBus,
    debounce = 500
  } = props;
  let updateViewport = function () {
    let $main = getMainElement();
    if ($main) {
      nextTick(() => {
        //console.log("FormItem:updateViewport");
        let rect = Rects.createBy($main!);
        let viewport = rect.toSize2D();
        setViewport(viewport);
      });
    }
  };

  let updateScrollTop = function () {
    let $main = getMainElement();
    if ($main && setScrollTop) {
      setScrollTop($main!.scrollTop);
    }
  };

  function updateMeasure() {
    updateViewport();
    updateScrollTop();
  }

  let debounceUpdateScrollTop = _.debounce(updateMeasure, debounce);
  let debounceUpdateMeasure = _.debounce(updateMeasure, debounce);

  if (onMounted) {
    onMounted(() => {
      updateMeasure();

      let $main = getMainElement();
      if ($main) {
        $main.addEventListener("scroll", debounceUpdateScrollTop);
      }

      if (GBus) {
        GBus.on(AppEvents.APP_RESIZE, debounceUpdateMeasure);
      }
    });
  }

  if (onUnmounted) {
    onUnmounted(() => {
      let $main = getMainElement();
      if ($main) {
        $main.removeEventListener("scroll", debounceUpdateScrollTop);
      }
      if (GBus) {
        GBus.off(debounceUpdateMeasure, AppEvents.APP_RESIZE);
      }
    });
  }

  return {
    updateViewport,
    updateScrollTop,
    updateMeasure,
    debounceUpdateMeasure
  };
}