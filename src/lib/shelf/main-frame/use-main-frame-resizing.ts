import _ from 'lodash';
import { ComputedRef, Ref } from 'vue';
import { Dragging, KeepFeature, KeepInfo, useDraggable, useKeep } from '../../';
import { Dom, Vars } from '../../../core';
import { saveChuteWidthToLocal } from './use-main-frame';

export type MainFrameResizingState = {
  /**
   * 格子的列，如果为空，就表示未定制，将采用默认设置
   */
  columns: string[];
};

export function keepSizesState(
  state: MainFrameResizingState,
  Keep: KeepFeature
) {
  let sizes = {} as Vars;
  if (!_.isEmpty(state.columns)) {
    sizes.columns = state.columns;
  }
  if (!_.isEmpty(sizes)) {
    Keep.save(sizes);
  }
}

export function useMainFrameResizing(
  $chute: HTMLElement,
  chuteWidth: Ref<number>,
  KeepChute: ComputedRef<KeepFeature>
): () => void {
  // Guard
  if (!_.isElement($chute)) {
    return () => {};
  }

  //console.log('useGridResizing', $main);
  return useDraggable({
    getWatchTarget: () => $chute,
    getDragTarget: (target: HTMLElement): HTMLElement | undefined => {
      return Dom.closest(target, '.adjust-bar', { includeSelf: true });
    },
    getViewport: () => {
      return Dom.closest($chute, '.ti-main-frame') || $chute;
    },
    onReady: (ing: Dragging) => {
      //console.log('onReady', ing);
      //ing.watchZone = Rects.createBy(ing.body!);
      ing.watchMode = 'stop';
      //console.log("onReady", ing.activated, ing.client);
    },
    onStart: (ing: Dragging) => {
      //console.log('onStart', ing);
      if (!ing.target || !ing.viwportElement) {
        return;
      }
    },
    onMoving: (ing: Dragging) => {
      let w = ing.client.x - ing.viewport.left;
      //console.log('onMoving', w);
      chuteWidth.value = w;
    },
    onEnd: (ing: Dragging) => {
      //console.log('onEnd', ing);
      saveChuteWidthToLocal(KeepChute, chuteWidth.value);
    },
  });
}
