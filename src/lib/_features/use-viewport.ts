import { Ref, reactive } from 'vue';
import { Callback, Rect, Size2D } from '../../_type';
import { Rects } from '../../core';

export type ViewportFeature = {
  getViewElement: () => HTMLElement | undefined;
  size: Size2D;
  updateViewPortSize: () => void;
  startWatch: () => void;
  stopWatch: () => void;
};

export type ViewportOptions = {
  el: Ref<HTMLElement | undefined>;
  emit?: (event: 'resize', rect: Rect) => void;
  onMounted?: (callback: Callback) => void;
  onUnmounted?: (callback: Callback) => void;
};

export function useViewport(options: ViewportOptions): ViewportFeature {
  let { el: $main, emit, onMounted, onUnmounted } = options;
  const _viewport = reactive({
    width: 0,
    height: 0,
  } as Size2D);

  function updateViewPortSize() {
    if ($main.value) {
      let rect = Rects.createBy($main.value);
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

  const obResize = new ResizeObserver((_entries) => {
    updateViewPortSize();
  });

  function startWatch() {
    if ($main.value) {
      obResize.observe($main.value);
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
    getViewElement: () => $main.value,
    size: _viewport,
    updateViewPortSize,
    startWatch,
    stopWatch,
  };
}
