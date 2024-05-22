<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import {
    ListSelectEmitInfo,
    TiIcon,
    TiList,
    ValueBoxEmits,
    useValueBox,
  } from '../../';
  import { CssUtils, Rect, Rects, Vars } from '../../../core';
  import { COM_TYPES } from '../../lib-com-types';
  import { InputBoxProps, InputBoxState } from './ti-input-types';
  import { dumpBoxState, resetTipList, updateTipList } from './use-input-box';
  import { getTipListConf } from './use-tip-box';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: true,
  });
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.Input;
  let emit = defineEmits<ValueBoxEmits>();
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
    prefixIconHovered: false,
    prefixTextHovered: false,
    suffixIconHovered: false,
    suffixTextHovered: false,

    lastUpdateAMS: 0,
  });
  //-----------------------------------------------------
  const _tips = ref<Vars[]>();
  //-----------------------------------------------------
  let props = withDefaults(defineProps<InputBoxProps>(), {
    autoI18n: true,
    tipShowTime: 'focus',
    tipHideTime: 'blur',
    tipUseHint: false,
    tipTidyBy: () => ['main'],
  });
  //-----------------------------------------------------
  const TipListConfig = computed(() => getTipListConf(props.tipList));
  //-----------------------------------------------------
  const $el = ref<any>(null);
  //-----------------------------------------------------
  const Box = computed(() =>
    useValueBox(_box_state, props, {
      emit,
      getBoxElement: () => $el.value,
      COM_TYPE,
    })
  );
  //-----------------------------------------------------
  const hasValue = computed(() => _.isNil(_box_state.boxValue));
  const showTipList = computed(() => (_tips.value ? true : false));
  const Placeholder = computed(() => Box.value.getPlaceholder());
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, Box.value.getClass(), {
      'has-value': hasValue.value,
      'nil-value': !hasValue.value,
      'is-focused': _box_state.boxFocused,
      'no-focused': !_box_state.boxFocused,
      'show-border': !props.hideBorder,
      'show-tip-list': showTipList.value,
    })
  );
  const TopStyle = computed((): Vars => {
    if (_box_rect.value) {
      return {
        position: 'fixed',
        width: `${_box_rect.value.width}px`,
        height: `${_box_rect.value.height}px`,
        top: `${_box_rect.value.top}px`,
        left: `${_box_rect.value.left}px`,
      };
    }
    return {};
  });
  const BracingStyle = computed((): Vars => {
    if (_box_rect.value) {
      return {
        width: `${_box_rect.value.width}px`,
        height: `${_box_rect.value.height}px`,
      };
    }
    return {};
  });
  const TipWrapperStyle = computed((): Vars => {
    if (_box_rect.value) {
      return {
        minWidth: `${_box_rect.value.width}px`,
      };
    }
    return {};
  });
  //-----------------------------------------------------
  const $input = ref<any>(null);
  //-----------------------------------------------------
  function OnInputFocused() {
    _box_state.boxFocused = true;
    if (props.autoSelect) {
      $input.value.select();
    }
  }
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
    resetTipList(_box_state, _tips);
    OnInputBlur();
  }
  //-----------------------------------------------------
  function OnInputChanged() {
    if (!_tips.value) {
      let val = $input.value.value;
      Box.value.doChangeValue(val);
    }
  }
  //-----------------------------------------------------
  function OnInputKeydown(_event: KeyboardEvent) {
    _box_state.keyboard = _event.key;
    _box_state.altKey = _event.altKey;
    _box_state.metaKey = _event.metaKey;
    _box_state.ctrlKey = _event.ctrlKey;
    _box_state.shiftKey = _event.shiftKey;
  }
  //-----------------------------------------------------
  function doUpdateTipList() {
    updateTipList(_box_state.boxInputing, _tips, {
      box: _box_state,
      tipShowTime: props.tipShowTime,
      tipHideTime: props.tipHideTime,
      dict: Box.value.dict,
      tipUseHint: props.tipUseHint ?? false,
      tipTidyBy: props.tipTidyBy ?? ['main'],
      tidyValue: Box.value.tidyValue,
    });
  }
  //-----------------------------------------------------
  function OnListSelect(payload: ListSelectEmitInfo) {
    let { currentId } = payload;
    console.log(currentId);
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
      console.log(`showTipList changed:  new=${newVal}  old=${oldVal}`);
      // 从隐藏变成显示
      if (true === newVal && false === oldVal) {
        updateBoxRect();
      }
      // 从显示变成隐藏
      else if (true === oldVal && false === newVal) {
        _box_rect.value = undefined;
      }
    }
  );

  //-------------------------------------------------
  const _box_rect = ref<Rect>();
  function updateBoxRect() {
    if ($el.value) {
      let rect = Rects.createBy($el.value);
      if (!_.isEqual(rect, _box_rect.value)) {
        console.log('resize to: ', rect.raw());
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
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-input-box prefix-suffix-box"
    :class="TopClass"
    :style="TopStyle"
    @mousedown="OnInputFocused"
    ref="$el">
    <div
      class="part-prefix as-icon-text"
      :class="Box.Prefix.className"
      :style="Box.Prefix.style">
      <TiIcon
        v-if="Box.Prefix.showIcon"
        class="as-icon at-prefix"
        :class="Box.Prefix.iconClass"
        :style="Box.Prefix.iconStyle"
        :value="Box.Prefix.icon"
        @click="Box.OnClickPrefixIcon"
        @mouseenter="Box.OnHoverPrefixIcon(true)" />
      <span
        v-if="Box.Prefix.showText"
        class="as-text at-prefix"
        :class="Box.Prefix.textClass"
        :style="Box.Prefix.textStyle"
        @click="Box.Prefix.OnClickText"
        >{{ Box.Prefix.text }}</span
      >
    </div>
    <div class="part-value">
      <input
        ref="$input"
        v-model="_box_state.boxInputing"
        spellcheck="false"
        :placeholder="Placeholder"
        @keydown="OnInputKeydown"
        @focus.stop="OnInputFocused"
        @change.stop="OnInputChanged"
        @blur.stop="OnInputBlur" />
    </div>
    <div
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
  </div>
  <!--=========: Tip Message ============-->
  <div
    class="ti-input-bracing"
    :style="BracingStyle"></div>
  <aside
    class="ti-input-tip-mask"
    v-if="showTipList"
    @click="OnClickTipMask">
    <pre
      style="font-size: 11px; font-family: 'Courier New', Courier, monospace">
  {{ dumpBoxState(_box_state) }}
  </pre
    >
  </aside>
  <div
    class="ti-input-tip-wrapper"
    v-if="showTipList"
    :style="TipWrapperStyle">
    <TiList
      v-bind="TipListConfig"
      :data="_tips"
      @select="OnListSelect" />
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-box.scss';
</style>
