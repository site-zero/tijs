import _ from 'lodash';
import { Ref } from 'vue';
import { Dom, Rects } from '../../../core';

export type TabsOverflow = {
  left: boolean;
  right: boolean;
};

export type TabsOverflowOptions = {
  ul: Ref<HTMLElement | undefined>;
  overflow: TabsOverflow;
};

export function useTabsOverflowObserver(options: TabsOverflowOptions) {
  let { ul, overflow } = options;

  function setOverflow(left: boolean, right: boolean) {
    overflow.left = left;
    overflow.right = right;
  }

  function updateOverflow() {
    let $lis = Dom.findAll('.tab-item', ul.value);
    // 防守
    if ($lis.length == 0) {
      setOverflow(false, false);
      return;
    }
    //console.log('updateOvflow', $lis);

    let N = $lis;
    let $liL = _.first($lis);
    let $liR = _.last($lis);

    let V = Rects.createBy(ul.value!);
    let L = Rects.createBy($liL!);
    let R = Rects.createBy($liR!);
    let l_ratio = L.getOverlapRatio(V);
    let r_ratio = R.getOverlapRatio(V);
    let _tr = 0.9;
    // console.log(`L: ${L} => ${L.area()}`, l_ratio);
    // console.log(`V: ${V}`);
    // console.log(`O: ${L.overlap(V)} => ${L.overlap(V).area()}`);

    // 判断相交
    let left = l_ratio < _tr;
    let right = r_ratio < _tr;

    //console.log({ left, right });
    setOverflow(left, right);
  }

  // 准备一个观察者
  let ob_rsz: ResizeObserver | undefined = undefined;
  let ob_mut: MutationObserver | undefined = undefined;

  // 调用者在合适的时机调用这个函数，启动 watch
  return {
    updateOverflow,
    tryWatch() {
      if (!ul.value || ob_rsz) {
        return;
      }
      // 尺寸调整
      if (!ob_rsz) {
        ob_rsz = new ResizeObserver(updateOverflow);
        ob_rsz.observe(ul.value);
      }

      // 内容变化
      if (!ob_mut) {
        ob_mut = new MutationObserver(updateOverflow);
        ob_mut.observe(ul.value, {
          childList: true,
        });
      }
    },

    depose() {
      ob_rsz?.disconnect();
      ob_rsz = undefined;

      ob_mut?.disconnect();
      ob_mut = undefined;
    },
  };
}
