import { Ref, reactive } from 'vue';
import { Callback, Rect, Size2D } from '../../_type';
import { Rects } from '../../core';
import _ from 'lodash';

export type ViewportFeature = ReturnType<typeof useViewport>;

export type ViewportOptions = {
  el: Ref<HTMLElement | undefined | null>;
  emit?: (event: 'resize', rect: Rect) => void;
  onMounted?: (callback: Callback) => void;
  onUnmounted?: (callback: Callback) => void;
};

export function useViewport(options: ViewportOptions) {
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

  const debounceUpdateViewPortSize = _.debounce(updateViewPortSize, 100);

  const obResize = new ResizeObserver((_entries) => {
    debounceUpdateViewPortSize();
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
