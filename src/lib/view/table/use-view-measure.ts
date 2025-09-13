import _ from "lodash";
import { nextTick } from "vue";
import { Callback1, FuncA0, Size2D } from "../../../_type";
import { Rects } from "../../../core";

const debug = false;

export type ViewMeasureProps = {
  getMainElement: FuncA0<HTMLElement | undefined>;
  setViewport: Callback1<Size2D>;
  setScrollTop?: Callback1<number>;
  debounce?: number;
};

/**
 * 需要在 mounted 之后调用
 *
 * @param props 传入属性
 * @returns
 */
export function useViewMeasure(props: ViewMeasureProps) {
  let { getMainElement, setViewport, setScrollTop, debounce = 500 } = props;
  let updateViewport = function ($main: HTMLElement) {
    if (debug) console.log("updateViewport =>", $main);
    nextTick(() => {
      //console.log("FormItem:updateViewport");
      let rect = Rects.createBy($main!);
      let viewport = rect.toSize2D();
      setViewport(viewport);
    });
  };

  let updateScrollTop = function ($main?: HTMLElement) {
    if (!$main) {
      $main = getMainElement();
    }
    if ($main && setScrollTop) {
      if (debug) console.log("updateScrollTop =>", $main);
      setScrollTop($main!.scrollTop);
    }
  };

  function updateMeasure($main?: HTMLElement) {
    if (!$main) {
      $main = getMainElement();
    }
    if ($main) {
      updateViewport($main);
      updateScrollTop($main);
    }
  }

  let debounceUpdateScrollTop = _.debounce(updateScrollTop, debounce);
  // let debounceUpdateMeasure = _.debounce(updateMeasure, debounce);

  function onTopScroll() {
    debounceUpdateScrollTop();
  }

  // Create a ResizeObserver instance
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (debug) console.log("objserve resize", entry.target);
      updateMeasure(entry.target as HTMLElement);
    }
  });

  let main_watched = false;

  function isMainWatched() {
    return main_watched;
  }

  function watchMain() {
    if (main_watched) {
      if (debug) console.warn("$main elemnent has been watched already!");
      return;
    }
    let $main = getMainElement();
    if ($main) {
      updateMeasure($main);
      $main.addEventListener("scroll", onTopScroll);
      resizeObserver.observe($main);
      main_watched = true;
    }
  }

  function unWatchMain() {
    let $main = getMainElement();
    if ($main) {
      $main.removeEventListener("scroll", onTopScroll);
      resizeObserver.disconnect();
    }
    main_watched = false;
  }

  // 貌似啥也不用返回
  return {
    updateViewport,
    updateScrollTop,
    updateMeasure,
    isMainWatched,
    watchMain,
    unWatchMain,
  };
}
