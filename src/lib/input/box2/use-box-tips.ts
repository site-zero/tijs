import _ from 'lodash';
import { computed, ComputedRef, ref, watch } from 'vue';
import { Rect } from '../../../_type';
import { CssUtils, Rects } from '../../../core';
import { getDockingStyle } from '../../_features';
//--------------------------------------------------
export type BoxTipsFeature = ReturnType<typeof useBoxTips>;
//--------------------------------------------------
export type BoxTipsProps = {
  getElement: () => HTMLElement | null;
  tipBoxVisible: ComputedRef<boolean>;
  hideBoxTip: () => void;
  // onMounted?: Callback;
  // onUnmounted?: Callback;
  /**
   * 展出提示框宽度，如果不声明，则采用与 box 相同的宽度
   */
  tipListWidth?: string;

  /**
   * 展出提示框最小宽度，如果不声明，则采用与 box 相同的宽度
   */
  tipListMinWidth?: string;
};
//--------------------------------------------------
export function useBoxTips(props: BoxTipsProps) {
  let { tipBoxVisible: _tip_box_visible } = props;
  //------------------------------------------------
  const _box_rect = ref<Rect>();
  let _parent_origin_area = 0;
  //------------------------------------------------
  const DumpInfo = computed(() => {
    let re = [`P:${_parent_origin_area}`];
    if (_box_rect.value) {
      re.push(_box_rect.value.toString());
    } else {
      re.push('~~Rect~~');
    }
    return re.join(':');
  });
  //------------------------------------------------
  function updateBoxRect() {
    let $el = props.getElement();
    if (!$el) {
      return {};
    }
    _box_rect.value = Rects.createBy($el);

    // 初始化一下父元素的面积，如果下次父元素面积改变剧烈，则表示
    // 页面进行了 resize，需要隐藏提示框
    let $pel = $el?.parentElement;
    if ($pel) {
      let _p_rect = Rects.createBy($pel);
      _parent_origin_area = _p_rect.area();
    }

    return { $el, $pel };
  }
  //------------------------------------------------
  /**
   * 监控 box 的父元素的尺寸变化，如果变化超过一定限度
   * 就需要自动隐藏当前提示信息。
   *
   * 否则，用户频繁缩放页面，会导致提示框错位
   */
  const obResize = new ResizeObserver(() => {
    let $el = props.getElement();
    let $pel = $el?.parentElement;
    if (_tip_box_visible.value && $pel) {
      let _p_rect = Rects.createBy($pel.parentElement!);
      let _p_area = _p_rect.area();
      if (Math.abs(_parent_origin_area - _p_area) > 10) {
        props.hideBoxTip();
      }
    }
  });
  //------------------------------------------------
  watch(
    () => _tip_box_visible.value,
    (visible) => {
      if (visible) {
        let { $pel } = updateBoxRect();
        if ($pel) {
          obResize.observe($pel);
        }
      }
      // 如果隐藏了，就清除 box 尺寸就好了
      else {
        obResize.disconnect();
        _box_rect.value = undefined;
        _parent_origin_area = 0;
      }
    }
  );
  //------------------------------------------------
  const TipWrapperStyle = computed(() => {
    let $el = props.getElement();
    let box = _box_rect.value;
    if (!$el || !box) {
      return {};
    }

    return getDockingStyle(
      {
        minWidth: props.tipListMinWidth ?? `${_.get(box, 'width')}px`,
        width: props.tipListWidth,
      },
      $el,
      box
    );
  });
  //------------------------------------------------
  const TipBoxStyleReady = computed(() => {
    return !_.isEmpty(TipWrapperStyle.value);
  });
  //------------------------------------------------
  const BoxMainStyle = computed(() => {
    if (TipBoxStyleReady.value && _box_rect.value) {
      return _box_rect.value.toCss();
    }
    return {};
  });
  //------------------------------------------------
  const BoxBraceStyle = computed(() => {
    if (_box_rect.value) {
      return CssUtils.toStyle({
        width: _box_rect.value.width,
        height: _box_rect.value.height,
      });
    }
  });
  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  return {
    DumpInfo,
    TipBoxStyleReady,
    BoxMainStyle,
    BoxBraceStyle,
    TipWrapperStyle,
  };
}
