<script setup lang="ts">
  import _ from 'lodash';
  import { computed, inject, nextTick, reactive, ref } from 'vue';
  import {
    BUS_KEY,
    TiEvent,
    TiIcon,
    tiGetDefaultComPropValue,
    useBusEmit,
  } from '../../';
  import { CssUtils } from '../../../core';
  import { TiInputInfo } from './ti-input-index';
  import {
    COM_TYPE,
    InputBoxEvents,
    InputBoxProps,
    InputBoxState,
    useInputBox,
  } from './use-input-box';
  /*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
  defineOptions({
    name: COM_TYPE,
    inheritAttrs: false,
  });
  /*-------------------------------------------------------

                        State

-------------------------------------------------------*/
  const state = reactive({
    boxVal: null,
    boxText: '',
    boxFocused: false,
    boxErrMsg: '',
    prefixIconHovered: false,
    prefixTextHovered: false,
    suffixIconHovered: false,
    suffixTextHovered: false,
  } as InputBoxState);
  /*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
  let props = withDefaults(defineProps<InputBoxProps>(), {
    value: tiGetDefaultComPropValue(COM_TYPE, 'value'),
    autoI18n: true,
  });
  /*-------------------------------------------------------

                    Event Bus 

-------------------------------------------------------*/
  let bus = inject(BUS_KEY);
  let emit = defineEmits<{
    (event: InputBoxEvents, payload: TiEvent<undefined>): void;
  }>();
  let notify = useBusEmit(TiInputInfo, props, emit, bus);
  /*-------------------------------------------------------

                      Features

-------------------------------------------------------*/
  const $el = ref<any>(null);
  const Box = computed(() =>
    useInputBox(state, props, {
      notify,
      valueChangeMode: 'both',
      getBoxElement: () => $el.value,
    }),
  );

  /*-------------------------------------------------------

                      Computed

-------------------------------------------------------*/
  const hasValue = computed(() => _.isNil(state.boxVal));
  const Placeholder = computed(() => Box.value.getPlaceholder());
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'has-value': hasValue.value,
      'nil-value': !hasValue.value,
      'is-focused': state.boxFocused,
      'no-focused': !state.boxFocused,
      'show-border': !props.hideBorder,
    }),
  );
  /*-------------------------------------------------------

                  Customized Methods

-------------------------------------------------------*/
  const _input = ref<any>(null);
  function OnInputFocused() {
    state.boxFocused = true;
    Box.value.doUpdateText();
    if (props.autoSelect) {
      nextTick(() => {
        _input.value.select();
      });
    }
  }
  function OnInputChanged() {
    let val = _input.value.value;
    Box.value.doChangeValue(val);
  }
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
        ref="_input"
        :value="state.boxText"
        spellcheck="false"
        :placeholder="Placeholder"
        @focus="OnInputFocused"
        @change="OnInputChanged"
        @blur="state.boxFocused = false" />
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
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-box.scss';
</style>
