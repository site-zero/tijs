<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { PrefixSuffixEvents, TiIcon } from '../../';
  import { CssUtils } from '../../../core';
  import { COM_TYPES } from '../../lib-com-types';
  import { LabelProps, LabelState } from './ti-label-types';
  import { useLabel } from './use-label';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: true,
  });
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.Label;
  //-----------------------------------------------------
  let emit = defineEmits<{
    (event: PrefixSuffixEvents): void;
    (event: 'change', payload: string): void;
  }>();
  //-----------------------------------------------------
  const state = reactive({
    boxValue: null,
    boxInputing: '',
    boxFocused: false,
    boxErrMsg: '',
    prefixIconHovered: false,
    prefixTextHovered: false,
    suffixIconHovered: false,
    suffixTextHovered: false,
  } as LabelState);

  let props = withDefaults(defineProps<LabelProps>(), {
    autoI18n: true,
  });
  //-----------------------------------------------------
  const $el = ref<any>(null);
  const Box = computed(() =>
    useLabel(state, props, {
      emit,
      getBoxElement: () => $el.value,
      COM_TYPE,
    })
  );
  /*-------------------------------------------------------

                      Computed

-------------------------------------------------------*/
  const hasValue = computed(() => {
    return !_.isNil(state.boxValue);
  });

  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, Box.value.getClass(), () => ({
      'has-value': hasValue.value,
      'nil-value': !hasValue.value,
    }))
  );
  const TextStyle = computed(() => {
    return {
      textAlign: props.textAlign,
    };
  });
  const LabelText = computed(() => {
    if (hasValue.value) {
      return state.boxInputing || state.boxValue;
    }
    return Box.value.getPlaceholder();
  });
  //-----------------------------------------------------
  // 看看是否满足选项列表的打开条件
  watch(
    () => [props.value],
    () => {
      state.boxValue = props.value;
      Box.value.doUpdateText();
    }
  );
  //-----------------------------------------------------
  onMounted(() => {
    Box.value.doUpdateText();
  });
</script>

<template>
  <div
    class="ti-label prefix-suffix-box"
    :class="TopClass"
    ref="$el">
    <div
      v-if="Box.Prefix.show"
      class="part-prefix as-icon-text"
      :class="Box.Prefix.className"
      :style="Box.Prefix.style">
      <TiIcon
        v-if="Box.Prefix.showIcon && hasValue"
        class="as-icon at-prefix"
        :class="Box.Prefix.iconClass"
        :style="Box.Prefix.iconStyle"
        :value="Box.Prefix.icon"
        @click="Box.OnClickPrefixIcon"
        @mouseenter="Box.setPrefixIconHover(true)"
        @mouseleave="Box.setPrefixIconHover(false)" />
      <span
        v-if="Box.Prefix.showText"
        class="as-text at-prefix"
        :class="Box.Prefix.textClass"
        :style="Box.Prefix.textStyle"
        @click="Box.Prefix.OnClickText"
        @mouseenter="Box.setPrefixTextHover(true)"
        @mouseleave="Box.setPrefixTextHover(false)"
        >{{ Box.Prefix.text }}</span
      >
    </div>
    <div
      class="part-value"
      :style="TextStyle">
      {{ LabelText }}
    </div>
    <div
      v-if="Box.Suffix.show"
      class="part-suffix as-icon-text"
      :class="Box.Suffix.className"
      :style="Box.Suffix.style">
      <span
        v-if="Box.Suffix.showText"
        class="as-text at-suffix"
        :class="Box.Suffix.textClass"
        :style="Box.Suffix.textStyle"
        @click="Box.Suffix.OnClickText"
        @mouseenter="Box.setSuffixTextHover(true)"
        @mouseleave="Box.setSuffixTextHover(false)"
        >{{ Box.Suffix.text }}</span
      >
      <TiIcon
        v-if="Box.Suffix.showIcon"
        :value="Box.Suffix.icon"
        class="as-icon at-suffix"
        :class="Box.Suffix.iconClass"
        :style="Box.Suffix.iconStyle"
        @click="Box.OnClickSuffixIcon"
        @mouseenter="Box.setSuffixIconHover(true)"
        @mouseleave="Box.setSuffixIconHover(false)" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-label.scss';
</style>
