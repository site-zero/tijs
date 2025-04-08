import _ from 'lodash';
import Sortable from 'sortablejs';
import { TagItem, TagsEmitter } from './ti-tags-types';

export type TagsSortableSetup = {
  getView: () => HTMLElement | null | undefined;
  enabled: boolean;
  getTagItems: () => TagItem[];
  setDragging: (dragging: boolean) => void;
  emit: TagsEmitter;
};

export function useTagsSortable(setup: TagsSortableSetup) {
  let _sortable: Sortable | null = null;

  function clearWatching() {
    if (_sortable) {
      _sortable.destroy();
      _sortable = null;
    }
  }

  function startWatching() {
    clearWatching();
    if (!setup.enabled) {
      return;
    }

    let view = setup.getView();
    if (!view) {
      return;
    }
    _sortable = new Sortable(view, {
      animation: 150,
      ghostClass: 'as-sorting-ghost',
      handle: '.as-tag-item',
      onStart: function () {
        setup.setDragging(true);
      },
      onEnd: function ({ oldIndex, newIndex }) {
        // 延后一下标记拖拽完毕，这样用户的鼠标在拖拽结束的
        // 不会立即触发标签尾部的删除按钮
        _.delay(() => setup.setDragging(false), 1000);
        if (oldIndex === newIndex || _.isNil(oldIndex) || _.isNil(newIndex)) {
          return;
        }
        // 准备传入数值
        let items = _.cloneDeep(setup.getTagItems());
        let it_me = items[oldIndex];
        let it_ta = items[newIndex];
        if (!it_me || !it_ta) {
          console.warn(
            'onEnd',
            `from items[${oldIndex}]=`,
            it_me,
            `to items[${oldIndex}]=`,
            it_ta
          );
          return;
        }

        items[oldIndex] = it_ta;
        items[newIndex] = it_me;
        //console.log('onEnd:>  ', items.map((it) => it.value).join(','));
        setup.emit('sorted', items);
      },
    });

    return _sortable;
  }

  return {
    startWatching,
    clearWatching,
  };
}
