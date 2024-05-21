<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { TiIcon, ValueBoxEmits } from '../../';
  import { CssUtils } from '../../../core';
  import { COM_TYPES } from '../../lib-com-types';
  import { InputBoxProps, TipBoxState } from './ti-input-types';
  import { InputBoxState, useInputBox } from './use-input-box';

  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.Input;
  defineOptions({
    inheritAttrs: true,
  });
  //-----------------------------------------------------
  const _box_state: InputBoxState = reactive({
    boxVal: null,
    boxText: '',
    //boxFocused: false,
    boxErrMsg: '',
    prefixIconHovered: false,
    prefixTextHovered: false,
    suffixIconHovered: false,
    suffixTextHovered: false,
  });

  const _tip_state: TipBoxState = reactive({
    keyboard: undefined,
    input: undefined,
    focused: false,
  });
  //-----------------------------------------------------
  let props = withDefaults(defineProps<InputBoxProps>(), {
    autoI18n: true,
    tipShowTime: 'focus',
    tipHideTime: 'blur',
  });
  //-----------------------------------------------------
  let emit = defineEmits<ValueBoxEmits>();
  //-----------------------------------------------------
  const $el = ref<any>(null);
  //-----------------------------------------------------
  const Box = computed(() =>
    useInputBox(_box_state, props, {
      emit,
      getBoxElement: () => $el.value,
      COM_TYPE,
    })
  );
  //-----------------------------------------------------
  function updateBoxText() {
    Box.value.doUpdateText(_tip_state.focused);
  }
  //-----------------------------------------------------
  const hasValue = computed(() => _.isNil(_box_state.boxVal));
  const Placeholder = computed(() => Box.value.getPlaceholder());
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, Box.value.getClass(), {
      'has-value': hasValue.value,
      'nil-value': !hasValue.value,
      'is-focused': _tip_state.focused,
      'no-focused': !_tip_state.focused,
      'show-border': !props.hideBorder,
    })
  );
  //-----------------------------------------------------
  const $input = ref<any>(null);
  //-----------------------------------------------------
  function OnInputFocused() {
    _tip_state.focused = true;
    if (props.autoSelect) {
      $input.value.select();
      // nextTick(() => {
      //   $input.value.select();
      // });
    }
  }
  //-----------------------------------------------------
  function OnInputBlur() {
    _tip_state.focused = false;
  }
  //-----------------------------------------------------
  function OnInputChanged() {
    let val = $input.value.value;
    Box.value.doChangeValue(val);
  }
  //-----------------------------------------------------
  function OnInputKeydown(event: KeyboardEvent) {
    _tip_state.keyboard = event.key;
  }
  //-----------------------------------------------------
  watch(
    () => [_box_state.boxVal, _tip_state.focused],
    () => {
      updateBoxText();
    }
  );
  //-----------------------------------------------------
  onMounted(() => {
    //console.log("TiInput mounted")
    _tip_state.focused = false;
    if (props.boxFocused) {
      _tip_state.focused = true;
      $input.value.select();
      //console.log($input)
    }
    Box.value.doUpdateText(_tip_state.focused);
  });
  //-----------------------------------------------------
</script>

<template>
  <div
    class="ti-input-box prefix-suffix-box"
    :class="TopClass"
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
        v-model="_box_state.boxText"
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
  <aside>
    _tip:{{ _tip_state }} <br />boxText:{{ _box_state.boxText }}
    <br />boxValu:{{ _box_state.boxVal }}
  </aside>
  <div class="ti-input-tip">I am Input Tip</div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-box.scss';
</style>
