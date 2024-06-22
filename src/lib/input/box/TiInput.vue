<script setup lang="ts">
  import _ from 'lodash';
  import {
    computed,
    inject,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
  } from 'vue';
  import {
    ListSelectEmitInfo,
    PrefixSuffixEvents,
    TiIcon,
    TiList,
    usePlaceholder,
    useValueBox,
  } from '../../';
  import { BUS_KEY, CssUtils, Match, Rect, Rects, Vars } from '../../../core';
  import { COM_TYPES } from '../../lib-com-types';
  import { InputBoxProps, InputBoxState } from './ti-input-types';
  import { resetTipList, updateTipList } from './use-input-box';
  import { getTipListConf, getTipWrapperStyle } from './use-tip-box';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.Input;
  const BUS_EVENT_FOCUS = 'INPUT_FOCUS';
  //-----------------------------------------------------
  let emit = defineEmits<{
    (event: PrefixSuffixEvents): void;
    (event: 'change', payload: string): void;
  }>();
  //-----------------------------------------------------
  const _box_state: InputBoxState = reactive({
    boxValue: null,
    boxInputing: '',
    boxFocused: false,
    keyboard: undefined,
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    boxErrMsg: '',
    boxIcon: undefined,
    boxTip: undefined,
    prefixIconHovered: false,
    prefixTextHovered: false,
    suffixIconHovered: false,
    suffixTextHovered: false,

    lastUpdateAMS: 0,
  });
  const _box_rect = ref<Rect>();
  //-----------------------------------------------------
  const _tips = ref<Vars[]>();
  //-----------------------------------------------------
  const bus = inject(BUS_KEY);
  //-----------------------------------------------------
  let props = withDefaults(defineProps<InputBoxProps>(), {
    autoI18n: true,
    tipShowTime: 'focus',
    tipUseHint: false,
    tipTidyBy: () => ['main'],
    canInput: true,
    trimed: true,
    // 自动，如果可编辑，就是 true ，否则就是 false
    checkValueWhenClose: undefined,
    autoSelect: true,
  });
  //-----------------------------------------------------
  const TipListConfig = computed(() => getTipListConf(props.tipList));
  //-----------------------------------------------------
  const $el = ref<HTMLElement>();
  //-------------------------------------------------
  let el_parent_area_hint = 0;
  const obResize = new ResizeObserver((_entries) => {
    if (showTipList.value) {
      let $pel = _entries[0].target;
      let rect = Rects.createBy($pel);
      let area = Math.round(rect.area());
      //console.log(el_parent_area_hint, area, $pel);
      if (Math.abs(el_parent_area_hint - area) > 10) {
        OnClickTipMask();
      }
    }
  });
  //-----------------------------------------------------
  const Box = computed(() =>
    useValueBox(_box_state, props, {
      emit,
      getBoxElement: () => $el.value,
      COM_TYPE,
    })
  );
  //-----------------------------------------------------
  const hasValue = computed(
    () => !_.isNil(_box_state.boxValue) && _box_state.boxValue
  );
  const showTipList = computed(() => (_tips.value ? true : false));
  const Placeholder = computed(() => usePlaceholder(props));
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, Box.value.getClass(), {
      'has-value': hasValue.value,
      'nil-value': !hasValue.value,
      'is-focused': _box_state.boxFocused,
      'no-focused': !_box_state.boxFocused,
      'show-border': !props.hideBorder,
      'hide-border': props.hideBorder,
      'show-tip-list': showTipList.value,
      'is-readonly': props.readonly,
    })
  );
  const TopStyle = computed((): Vars => {
    let css = CssUtils.toStyle(props.style);
    if (_box_rect.value) {
      return _.assign(css, {
        position: 'fixed',
        width: `${_box_rect.value.width}px`,
        height: `${_box_rect.value.height}px`,
        top: `${_box_rect.value.top}px`,
        left: `${_box_rect.value.left}px`,
      });
    }
    return _.assign(css, {
      width: CssUtils.toSize(props.width),
    });
  });
  const BracingStyle = computed((): Vars => {
    if (_box_rect.value) {
      return {
        //width: `${_box_rect.value.width}px`,
        display: 'block',
        height: `${_box_rect.value.height}px`,
      };
    }
    return {};
  });
  const TipWrapperStyle = computed(() =>
    getTipWrapperStyle(props, $el.value, _box_rect.value)
  );
  //-----------------------------------------------------
  const TipListData = computed(() => {
    if (props.showCleanOption && hasValue.value) {
      let re = [
        {
          text: 'i18n:clear',
          value: null,
        },
      ] as Vars[];
      if (_tips.value) {
        re.push(..._tips.value);
      }
      return re;
    }
    return _tips.value;
  });
  //-----------------------------------------------------
  const $input = ref<any>(null);
  //-----------------------------------------------------
  function OnInputMousedown() {
    if (props.readonly) {
      return;
    }
    _box_state.boxFocused = true;
  }
  //-----------------------------------------------------
  function OnInputFocused() {
    if (props.readonly) {
      return;
    }
    console.log('OnInputFocused');
    bus?.emit(BUS_EVENT_FOCUS);
    _box_state.boxFocused = true;
    if (props.autoSelect) {
      $input.value.select();
    }
  }
  //-----------------------------------------------------
  function when_bus_input_focus() {
    resetTipList(_box_state, _tips);
    OnInputBlur();
  }
  bus?.onName(BUS_EVENT_FOCUS, when_bus_input_focus);
  //-----------------------------------------------------
  function OnInputBlur() {
    if (!_tips.value) {
      _box_state.boxFocused = false;
      _box_state.keyboard = undefined;
      _box_state.altKey = false;
      _box_state.ctrlKey = false;
      _box_state.shiftKey = false;
      _box_state.metaKey = false;
    }
  }
  //-----------------------------------------------------
  function OnClickTipMask() {
    let checkValueWhenClose =
      props.checkValueWhenClose ?? props.canInput ?? false;
    resetTipList(_box_state, _tips);
    if (checkValueWhenClose) {
      if (props.mustInOptions) {
        // 是不是清空了？
        console.log(_box_state.boxInputing);
        let val = _box_state.boxInputing;
        console.log('OnClickTipMask', val);
        Box.value.doChangeValue(val ?? '');
      }
      // 自由输入模式
      else {
        let val = _box_state.boxInputing;
        Box.value.doChangeValue(val);
      }
    }
    OnInputBlur();
  }
  //-----------------------------------------------------
  function OnInputChanged() {
    if (!_tips.value) {
      let val = _box_state.boxInputing;
      Box.value.doChangeValue(val);
    }
  }
  //-----------------------------------------------------
  function OnInputKeydown(event: KeyboardEvent) {
    _box_state.keyboard = event.key;
    _box_state.altKey = event.altKey;
    _box_state.metaKey = event.metaKey;
    _box_state.ctrlKey = event.ctrlKey;
    _box_state.shiftKey = event.shiftKey;

    // 选择高亮项目
    if (/^Arrow(Up|Down)$/.test(event.key)) {
      // 这个需要让 TiList 提供一个回调函数
      // 可以回来注册一个 API 提供 上下移动的能力
    }
    // 取消
    else if ('Escape' == event.key) {
      resetTipList(_box_state, _tips);
      OnInputBlur();
    }
    // 确认
    else if ('Enter' == event.key) {
      resetTipList(_box_state, _tips);
    }
  }
  //-----------------------------------------------------
  const BoxOptionFilter = computed(() => {
    if (props.optionFilter) {
      return Match.parse(props.optionFilter, false);
    }
  });
  //-----------------------------------------------------
  function doUpdateTipList() {
    updateTipList(_box_state.boxInputing, _tips, {
      box: _box_state,
      tipShowTime: props.tipShowTime,
      dict: Box.value.dict,
      tipUseHint: props.tipUseHint ?? false,
      tipTidyBy: props.tipTidyBy ?? ['main'],
      tidyValue: Box.value.tidyValue,
      optionFiler: BoxOptionFilter.value,
    });
  }
  //-----------------------------------------------------
  function OnListSelect(payload: ListSelectEmitInfo) {
    let { currentId } = payload;
    //console.log('OnListSelect', currentId);
    let val = _.isNumber(currentId) ? `${currentId}` : currentId;
    Box.value.doChangeValue(val ?? '');
    // TODO if multi 可能需要特别处理一下
    resetTipList(_box_state, _tips);
    OnInputBlur();
  }
  //-----------------------------------------------------
  watch(
    () => Box.value,
    () => {
      resetTipList(_box_state, _tips);
      _box_state.boxFocused = false;
    }
  );
  //-----------------------------------------------------
  // 看看是否满足选项列表的打开条件
  watch(
    () => [_box_state.boxValue, _box_state.boxFocused],
    //() => [_box_state.boxValue],
    () => {
      Box.value.doUpdateText();
      doUpdateTipList();
    }
  );
  //-----------------------------------------------------
  // 看看是否满足选项列表的打开条件
  watch(
    () => props.format,
    () => {
      Box.value.doUpdateText();
    }
  );
  //-----------------------------------------------------
  // 输入触发选项列表刷新
  watch(
    () => _box_state.boxInputing,
    () => {
      doUpdateTipList();
    }
  );
  //-----------------------------------------------------
  // 当选项列表转为显示，则计算展位盒子的矩形
  watch(
    () => showTipList.value,
    (newVal, oldVal) => {
      // console.log(`showTipList changed:  new=${newVal}  old=${oldVal}`);
      // 从隐藏变成显示
      if (true === newVal && false === oldVal) {
        let $pel = $el.value?.parentElement?.parentElement;
        if ($pel) {
          let rect = Rects.createBy($pel);
          el_parent_area_hint = Math.round(rect.area());
          obResize.observe($pel);
        }
        updateBoxRect();
      }
      // 从显示变成隐藏
      else if (true === oldVal && false === newVal) {
        _box_rect.value = undefined;
        obResize.disconnect();
      }
    }
  );
  //-------------------------------------------------

  function updateBoxRect() {
    if ($el.value) {
      let rect = Rects.createBy($el.value);
      if (!_.isEqual(rect, _box_rect.value)) {
        //console.log('resize to: ', rect.raw());
        _box_rect.value = rect;
      }
    } else {
      _box_rect.value = undefined;
    }
  }

  //-----------------------------------------------------
  onMounted(() => {
    //console.log("TiInput mounted")
    OnInputBlur();
    _box_state.boxFocused = false;
    if (props.boxFocused) {
      _box_state.boxFocused = true;
      $input.value.select();
      //console.log($input)
    }
    Box.value.doUpdateText();
  });
  onUnmounted(() => {
    obResize.disconnect();
    bus?.offName(BUS_EVENT_FOCUS, when_bus_input_focus);
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-input-box prefix-suffix-box"
    :class="TopClass"
    :style="TopStyle"
    @mousedown="OnInputMousedown"
    ref="$el">
    <!--====: part prefix :=======-->
    <slot name="prefix">
      <div
        v-if="Box.Prefix.showText || Box.Prefix.showIcon"
        class="part-prefix as-icon-text"
        :class="Box.Prefix.className"
        hello="aaa"
        :style="Box.Prefix.style">
        <TiIcon
          v-if="Box.Prefix.showIcon"
          class="as-icon at-prefix"
          :class="Box.Prefix.iconClass"
          :style="Box.Prefix.iconStyle"
          :value="Box.Prefix.icon"
          @mousedown.stop
          @click="Box.OnClickPrefixIcon"
          @mouseenter="Box.OnHoverPrefixIcon(true)"
          @mouseleave="Box.OnHoverPrefixIcon(false)" />
        <span
          v-if="Box.Prefix.showText"
          class="as-text at-prefix"
          :class="Box.Prefix.textClass"
          :style="Box.Prefix.textStyle"
          @click="Box.Prefix.OnClickText"
          >{{ Box.Prefix.text }}</span
        >
      </div>
    </slot>
    <!--====: part value :=======-->
    <div class="part-value">
      <input
        ref="$input"
        v-model="_box_state.boxInputing"
        spellcheck="false"
        :readonly="!props.canInput || props.readonly"
        :placeholder="Placeholder"
        @keydown="OnInputKeydown"
        @focus.stop="OnInputFocused"
        @change.stop="OnInputChanged"
        @blur.stop="OnInputBlur"
        @dblclick.stop />
    </div>
    <!--====: part suffix :=======-->
    <slot name="suffix">
      <div
        v-if="Box.Suffix.showText || Box.Suffix.showIcon"
        class="part-suffix as-icon-text"
        :class="Box.Suffix.className"
        :style="Box.Suffix.style">
        <span
          v-if="Box.Suffix.showText"
          class="as-text at-suffix"
          :class="Box.Suffix.textClass"
          :style="Box.Suffix.textStyle"
          @click="Box.Suffix.OnClickText"
          >{{ Box.Suffix.text }}</span
        >
        <TiIcon
          v-if="Box.Suffix.showIcon"
          :value="Box.Suffix.icon"
          class="as-icon at-suffix"
          :class="Box.Suffix.iconClass"
          :style="Box.Suffix.iconStyle"
          @click="Box.OnClickSuffixIcon" />
      </div>
    </slot>
  </div>
  <!--=========: Tip Message ============-->
  <div
    class="ti-input-bracing"
    :style="BracingStyle"></div>
  <aside
    class="ti-input-tip-mask"
    v-if="showTipList"
    @click="OnClickTipMask">
    <!--pre>{{ dumpBoxState(_box_state) }}</pre-->
  </aside>
  <div
    class="ti-input-tip-wrapper"
    v-if="showTipList"
    :style="TipWrapperStyle">
    <div class="tip-con">
      <TiList
        v-bind="TipListConfig"
        :currentId="_box_state.boxValue"
        :data="TipListData"
        @select="OnListSelect" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-box.scss';
</style>
