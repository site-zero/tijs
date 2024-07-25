import _ from 'lodash';
import { Dom } from '../../../core';
import { ref, Ref } from 'vue';

export type TabsOverflow = {
  left: boolean;
  right: boolean;
};

export type TabsOverflowOptions = {
  ul: Ref<HTMLElement | undefined>;
  overflow: TabsOverflow;
};

// 记录一下监控项目的数量
// 以便知道中点下标
// 这样就能知道是左右那边溢出了
const _item_N = ref(0);

export function useTabsOverflowObserver(options: TabsOverflowOptions) {
  let { ul, overflow } = options;

  const updateOverflow: IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[]
  ) => {
    let N = _item_N.value;
    let M = N / 2;
    for (let i = 0; i < entries.length; i++) {
      let en = entries[i];
      console.log(`${i}/${N}`, en.target.textContent, en.intersectionRatio);

      // 不相交，看看是左边还是右边的
      if (en.intersectionRatio < 0.9) {
        if (i < M) {
          overflow.left = true;
        } else if (overflow.right) {
          break;
        } else {
          overflow.right = true;
        }
      }
    }
  };

  let ob: IntersectionObserver | undefined = undefined;

  // 调用者在合适的时机调用这个函数，启动 watch
  return {
    reWatch() {
      if (!ul.value) {
        return;
      }
      // 如果之前创建过 ...
      if (ob) {
        ob.disconnect();
      }
      // 重新创建
      ob = new IntersectionObserver(updateOverflow, {
        root: ul.value,
        threshold: 0.1,
      });
      // 开始追踪目标
      let $lis = Dom.findAll(':scope > li', ul.value);
      _item_N.value = $lis.length;
      for (let $li of $lis) {
        ob.observe($li);
      }
    },

    depose() {
      ob?.disconnect();
      ob = undefined;
    },
  };
}
