import _ from 'lodash';
import { reactive } from 'vue';
import { Callback, Rect, Size2D } from '../../_type';
import { Rects } from '../../core';

export type ViewportApi = ReturnType<typeof useViewport>;

export type ViewportOptions = {
  //el: Ref<HTMLElement | undefined | null>;
  getElement: () => HTMLElement | undefined | null;
  emit?: (event: 'resize', rect: Rect) => void;
  onMounted?: (callback: Callback) => void;
  onUnmounted?: (callback: Callback) => void;
};

export function useViewport(options: ViewportOptions) {
  let { getElement, emit, onMounted, onUnmounted } = options;
  const _viewport = reactive({
    width: 0,
    height: 0,
  } as Size2D);

  function updateViewPortSize() {
    let el = getElement();
    if (el) {
      let rect = Rects.createBy(el);
      if (rect.width > 0 && rect.width != _viewport.width) {
        _viewport.width = rect.width;
      }
      if (rect.height > 0 && rect.height != _viewport.height) {
        _viewport.height = rect.height;
      }
      if (emit) {
        emit('resize', rect);
      }
    }
  }

  const debounceUpdateViewPortSize = _.debounce(updateViewPortSize, 100);

  const obResize = new ResizeObserver((_entries) => {
    debounceUpdateViewPortSize();
  });

  function startWatch() {
    let el = getElement();
    if (el) {
      obResize.observe(el);
    }
  }

  function stopWatch() {
    obResize.disconnect();
  }

  if (onMounted) {
    onMounted(startWatch);
  }

  if (onUnmounted) {
    onUnmounted(stopWatch);
  }

  return {
    getViewElement: getElement,
    size: _viewport,
    updateViewPortSize,
    startWatch,
    stopWatch,
  };
}
